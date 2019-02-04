package game

import (
	//"github.com/SolarLune/resolv/resolv"
	"github.com/gorilla/websocket"
)

// The entity representing the character on the server.
type PlayerCharacter struct {
	//	Collider *resolv.Circle
	State *PlayerState
}

type Client struct {
	Connection *websocket.Upgrader

	pState    *PlayerState
	gameState *GameState
}

func (c *Client) Replicate() {}

type PlayerCondition int

const (
	ALIVE PlayerCondition = 1 << iota
	DOWN
	DEAD
)

type PlayerState struct {
	X int `json:"x"`
	Y int `json:"y"`

	State PlayerCondition `json:"condition"`
}

type GameState struct{}
type GameMode struct{}
