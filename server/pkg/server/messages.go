package server

type JoinGameRequest struct {
	Username string `json:"username"`
	GameID   int    `json:"gameid"`
}
type JoinGameResponse struct {
	Error string
	Token string `json:"token"`
}

type CreateGameRequest struct{}
type CreateGameResponse struct {
	GameID int `json:"gameid"`
}
