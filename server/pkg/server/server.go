package server

import (
	"github.com/chronojam/submariner/server/pkg/config"
)

// New creates a new instance of the submariner Server
func New(c *config.Config) *Server {
	return &Server{
		config: c,
	}
}

// Server is the concrete definition of the Server object
type Server struct {
	config *config.Config
}
