package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/chronojam/submariner/server/pkg/config"
	"github.com/chronojam/submariner/server/pkg/game"
	"github.com/google/uuid"
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
		sessions:       map[string]int{},
		connections:    []*websocket.Conn{},
		playerStates:   []*game.PlayerState{},
		gameStates:     []*game.GameState{},
		gameModes:      []*game.GameMode{},
	}
}

// Server is the concrete definition of the Server object
type Server struct {
	config         *config.Config
	state          *game.GameState
	allowedOrigins []string
	stopChan       chan int

	sessions map[string]int
	// Game gubbins.
	// connections and playerstates maintain a 1-2-1 mapping
	// i.e connections[i] belongs to playerStates[i]
	connections  []*websocket.Conn
	playerStates []*game.PlayerState

	// GameStates and GameModes maintain a 1-2-1 mapping
	// i.e gameStates[i] belongs to gameModes[i]
	gameStates []*game.GameState
	gameModes  []*game.GameMode
}

func (s *Server) Serve() {
	http.HandleFunc("/game/join", s.JoinGame)
	http.HandleFunc("/game/create", s.CreateGame)
	http.HandleFunc("/ws/connect", s.NewClient)
	var addr = fmt.Sprintf("%s:%d", s.config.IP, s.config.Port)
	log.Printf("Server starting on: %s", addr)
	go s.BeginUpdatePush()
	log.Fatal(http.ListenAndServe(addr, nil))
}

func (s *Server) setupCORS(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8080")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func (s *Server) createGame(req *CreateGameRequest) (*CreateGameResponse, error) {
	uResponse := &CreateGameResponse{}
	s.gameModes = append(s.gameModes, &game.GameMode{})
	s.gameStates = append(s.gameStates, &game.GameState{})

	uResponse.GameID = len(s.gameModes) - 1
	return uResponse, nil
}

func (s *Server) joinGame(req *JoinGameRequest) (*JoinGameResponse, error) {
	uResponse := &JoinGameResponse{}
	s.playerStates = append(s.playerStates, &game.PlayerState{})
	s.connections = append(s.connections, nil)
	ID := len(s.playerStates) - 1
	s.gameModes[req.GameID].Players = append(s.gameModes[req.GameID].Players, ID)

	Session := uuid.New().String()
	uResponse.Token = Session

	return uResponse, nil
}

func (s *Server) marshalBodyToRequest(r *http.Request, i interface{}) error {
	if r.Body == nil || r.Method != "POST" {
		log.Printf("Improper request type")
		return errors.New("Bad Request.")
	}
	defer r.Body.Close()

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error while reading body.")
		return errors.New("Internal Server Error.")
	}

	err = json.Unmarshal(b, i)
	if err != nil {
		log.Printf("Error while unmarshalling body.")
		return errors.New("Bad request; Improper JSON.")
	}

	return nil
}

func (s *Server) CreateGame(w http.ResponseWriter, r *http.Request) {
	s.setupCORS(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	var req CreateGameRequest
	err := s.marshalBodyToRequest(r, &req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	resp, err := s.createGame(&req)
	if err != nil {
		log.Printf("Error while creating game: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	b, err := json.Marshal(resp)
	if err != nil {
		log.Printf("Error while marshaling response.")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(b)
}

func (s *Server) JoinGame(w http.ResponseWriter, r *http.Request) {
	s.setupCORS(w, r)
	if r.Method == "OPTIONS" {
		return
	}
	defer r.Body.Close()
	uResponse := &JoinGameResponse{}
	defer func() {
		b, _ := json.Marshal(uResponse)
		w.Write(b)
	}()
	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error while reading server.JoinGame body request.\n %v", err)
		uResponse.Error = "Internal Server Error"
		w.WriteHeader(500)
		return
	}
	var req JoinGameRequest
	err = json.Unmarshal(b, &req)
	if err != nil {
		log.Printf("Error while unmarshalling body in server.JoinGame(): \n%v", err)
		uResponse.Error = "Incorrect Input for Username or GameID; Expected: Username(string); GameID(int);"
		w.WriteHeader(400)
		return
	}
	if (req.GameID > len(s.gameStates)-1) || (req.GameID < 0) {
		uResponse.Error = "Invalid GameID"
		w.WriteHeader(400)
		return
	}

	if req.Username == "" {
		uResponse.Error = "Invalid Username"
		w.WriteHeader(400)
		return
	}

	resp, err := s.joinGame(&req)
	if err != nil {
		panic("hello")
	}
	http.SetCookie(w, &http.Cookie{
		Name:  "SessionID",
		Value: resp.Token,
	})
}

func (s *Server) BeginUpdatePush() {
	ticker := time.NewTicker(CLIENT_UPDATE_FREQUENCY)
	for {
		select {
		case <-ticker.C:
			for i, gm := range s.gameModes {
				for _, j := range gm.Players {
					if s.connections[j] == nil {
						continue
					}
					err := s.connections[j].WriteJSON(s.playerStates[j])
					if err != nil {
						log.Printf("Error while sending playerstate to client. %v", err)
						continue
					}

					err = s.connections[j].WriteJSON(s.gameStates[i])
					if err != nil {
						log.Printf("Error while sending gamestate to client. %v", err)
						continue
					}
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
	sessionId, err := r.Cookie("SessionID")
	if err != nil {
		w.WriteHeader(403)
		return
	}
	if _, ok := s.sessions[sessionId.Value]; !ok {
		w.WriteHeader(403)
		return
	}
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

	id := s.sessions[sessionId.Value]
	// Guess we're valid?
	s.connections[id] = c
	s.playerStates[id] = &game.PlayerState{}
	go s.ReadIncomingMessages(c, id)
}
