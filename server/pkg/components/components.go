package components

// Component represents the concrete implementation of
// a Component.
type Component interface {
	Type() int
}

const (
	UNKNOWN  = 1 << iota
	NAME     = 1 << iota
	POSITION = 1 << iota
)

type Name string

func (n Name) Type() int { return NAME }
