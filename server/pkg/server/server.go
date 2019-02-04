package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/chronojam/submariner/server/pkg/config"
	"github.com/chronojam/submariner/server/pkg/game"
	"github.com/gorilla/websocket"
)

const (
	CLIENT_UPDATE_FREQUENCY = time.Second
)

// New creates a new instance of the submariner Server
func New(c *config.Config) *Server {
	return &Server{
		config:         c,
		state:          &game.GameState{},
		allowedOrigins: c.AllowedOrigins,
		stopChan:       make(chan int),

		connections:  []*websocket.Conn{},
		playerStates: []*game.PlayerState{},
		gameState:    &game.GameState{},
	}
}

// Server is the concrete definition of the Server object
type Server struct {
	config         *config.Config
	state          *game.GameState
	allowedOrigins []string
	stopChan       chan int

	// Game gubbins.
	connections  []*websocket.Conn
	playerStates []*game.PlayerState
	gameState    *game.GameState
}

func (s *Server) Serve() {
	http.HandleFunc("/ws/connect", s.NewClient)
	var addr = fmt.Sprintf("%s:%d", s.config.IP, s.config.Port)
	log.Printf("Server starting on: %s", addr)
	go s.BeginUpdatePush()
	log.Fatal(http.ListenAndServe(addr, nil))
}

func (s *Server) BeginUpdatePush() {
	ticker := time.NewTicker(CLIENT_UPDATE_FREQUENCY)
	for {
		select {
		case <-ticker.C:
			for _, c := range s.connections {
				err := c.WriteJSON(s.playerStates)
				if err != nil {
					log.Printf("Error while sending playerstate to client. %v", err)
					continue
				}

				err = c.WriteJSON(s.gameState)
				if err != nil {
					log.Printf("Error while sending gamestate to client. %v", err)
					continue
				}
			}
		case <-s.stopChan:
			ticker.Stop()
			return
		}
	}
}

func (s *Server) ReadIncomingMessages(c *websocket.Conn, stateIndex int) {
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Printf("Error while reading message from Client: %v", err)
			continue
		}
		var proposedState game.PlayerState
		err = json.Unmarshal(message, &proposedState)
		if err != nil {
			log.Printf("Improper JSON recieved.")
			continue
		}

		err = s.ValidateAndApplyState(proposedState, stateIndex)
		if err != nil {
			log.Printf("Unable to validate client state: %v", err)
			continue
		}
	}
}

func (s *Server) ValidateAndApplyState(proposed game.PlayerState, index int) error {
	return nil
}

func (s *Server) NewClient(w http.ResponseWriter, r *http.Request) {
	sock := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			incomingFrom := r.Header.Get("Origin")
			for _, origin := range s.allowedOrigins {
				if origin == incomingFrom {
					return true
				}
			}
			return false
		},
	}
	c, err := sock.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Could not open connection %v", err)
		return
	}
	s.connections = append(s.connections, c)
	s.playerStates = append(s.playerStates, &game.PlayerState{})
	stateIndex := len(s.playerStates) - 1
	go s.ReadIncomingMessages(c, stateIndex)
}
