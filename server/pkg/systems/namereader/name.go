package namereader

import (
	"fmt"
	"io"

	"github.com/chronojam/submariner/server/pkg/world"
)

func New(w *world.World, out io.Writer) *nameReader {
	return &nameReader{
		w:   w,
		out: out,
	}
}

type nameReader struct {
	w   *world.World
	out io.Writer
}

func (s *nameReader) Update() {
	for _, n := range s.w.CNames {
		fmt.Fprintf(s.out, string(n))
	}
}
