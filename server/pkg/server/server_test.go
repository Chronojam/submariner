package server

import (
	"testing"

	"github.com/chronojam/submariner/server/pkg/config"
)

func TestConstructServer(t *testing.T) {
	_ = New(&config.Config{
		IP:   "0.0.0.0",
		Port: 8000,
	})
}
