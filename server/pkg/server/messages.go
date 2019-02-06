package server

type JoinGameRequest struct {
	Username string `json:"username"`
	GameID   int    `json:"gameid"`
}
type JoinGameResponse struct {
	Token string `json:"token"`
	Error string `json:"error"`
}

type CreateGameRequest struct{}
type CreateGameResponse struct {
	Error string `json:"error"`
}
