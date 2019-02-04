package main

import (
	"flag"

	"github.com/chronojam/submariner/server/pkg/config"
	"github.com/chronojam/submariner/server/pkg/server"
)

var (
	ip   = flag.String("-ip-address", "0.0.0.0", "IP Address to listen on")
	port = flag.Int("-port", 8000, "Port to listen for incoming requests")
)

func init() {
	flag.Parse()
}

func main() {
	c := &config.Config{
		IP:   *ip,
		Port: *port,
		AllowedOrigins: []string{
			"http://localhost:3000",
		},
	}

	s := server.New(c)
	s.Serve()
}
