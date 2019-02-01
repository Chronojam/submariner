package components

import (
	"github.com/SolarLune/resolv/resolv"
)

// ComponentBit represents the bit a component represents.
type ComponentBit uint

// ComponentIndex represents the index in the entity matrix
// contains the instance of this component
type ComponentIndex uint

// Component represents the actual component implementation itself.
type Component interface {
	Bit() ComponentBit
	Index() ComponentIndex
}

const (
	UNKNOWN ComponentBit = 1 << iota
	NAME
	IMAGE
	COLLIDER
	PLAYER
)

type NameComponent string

func (n NameComponent) Bit() ComponentBit     { return NAME }
func (n NameComponent) Index() ComponentIndex { return 1 }

type ImageComponent string

func (i ImageComponent) Bit() ComponentBit     { return IMAGE }
func (i ImageComponent) Index() ComponentIndex { return 2 }

type ColliderComponent resolv.Shape

func (c ColliderComponent) Bit() ComponentBit     { return COLLIDER }
func (c ColliderComponent) Index() ComponentIndex { return 3 }

type PlayerComponent struct{}

func (p PlayerComponent) Bit() ComponentBit     { return PLAYER }
func (p PlayerComponent) Index() ComponentIndex { return 4 }
