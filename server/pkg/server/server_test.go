package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http/httptest"
	"testing"

	"github.com/chronojam/submariner/server/pkg/config"
)

func TestConstructServer(t *testing.T) {
	_ = New(&config.Config{
		IP:   "0.0.0.0",
		Port: 8000,
	})
}
func TestJoinGame(t *testing.T) {
	s := New(&config.Config{
		IP:   "0.0.0.0",
		Port: 8000,
	})

	resp, _ := s.createGame(&CreateGameRequest{})
	body := bytes.NewBufferString(fmt.Sprintf("{ \"username\": \"bob\", \"gameid\": %d}", resp.GameID))

	t.Run("MarshalBodyToRequest", func(t *testing.T) {
		for _, method := range []string{"GET", "PUT", "OPTIONS", "PATCH"} {
			t.Run(method, func(t *testing.T) {
				r := httptest.NewRequest(method, "http://localhost:8000/game/join", body)
				req := &JoinGameRequest{}
				if err := s.marshalBodyToRequest(r, req); err == nil {
					t.Fail()
				}
			})
		}

		t.Run("POST", func(t *testing.T) {
			r := httptest.NewRequest("POST", "http://localhost:8000/game/join", body)
			req := &JoinGameRequest{}
			if err := s.marshalBodyToRequest(r, req); err != nil {
				t.Fail()
			}
		})
	})

}
func TestCreateGame(t *testing.T) {
	s := New(&config.Config{
		IP:   "0.0.0.0",
		Port: 8000,
	})

	t.Run("MarshalBodyToRequest", func(t *testing.T) {
		for _, method := range []string{"GET", "PUT", "OPTIONS", "PATCH"} {
			t.Run(method+"WithEmptyBody", func(t *testing.T) {
				r := httptest.NewRequest(method, "http://localhost:8000/game/new", bytes.NewBufferString("{}"))
				req := &CreateGameRequest{}
				if err := s.marshalBodyToRequest(r, req); err == nil {
					t.Fail()
				}
			})
		}
	})
	t.Run("CreateGame", func(t *testing.T) {
		req := &CreateGameRequest{}
		_, err := s.createGame(req)
		if err != nil {
			t.Fail()
		}
		if len(s.gameModes) == 0 || len(s.gameStates) == 0 {
			t.Fail()
		}
	})
	t.Run("CreateGameHTTP", func(t *testing.T) {
		for _, method := range []string{"GET", "PUT", "PATCH"} {
			t.Run(method, func(t *testing.T) {
				r := httptest.NewRequest(method, "http://localhost:8000/game/new", bytes.NewBufferString("{}"))
				w := httptest.NewRecorder()
				s.CreateGame(w, r)
				if w.Code == 200 {
					log.Printf("%d", w.Code)
					t.Fail()
				}
			})
		}

		t.Run("POST", func(t *testing.T) {
			r := httptest.NewRequest("POST", "http://localhost:8000/game/new", bytes.NewBufferString("{}"))
			w := httptest.NewRecorder()
			s.CreateGame(w, r)
			if w.Code != 200 {
				t.Fail()
			}
			var out CreateGameResponse
			err := json.Unmarshal(w.Body.Bytes(), &out)
			if err != nil {
				t.Fail()
			}
		})
	})
}
