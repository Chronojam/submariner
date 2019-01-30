package main

import (
	"flag"
)

var (
	ip   = flag.String("-ip-address", "0.0.0.0", "IP Address to listen on")
	port = flag.Int("-port", 8000, "Port to listen for incoming requests")
)

func init() {
	flag.Parse()
}

func main() {

}
