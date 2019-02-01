package world

import (
	"sync"

	"github.com/chronojam/submariner/server/pkg/components"
	"github.com/chronojam/submariner/server/pkg/systems"
)

func New() *World {
	return &World{
		entityMutex: &sync.Mutex{},
	}
}

type World struct {
	entityMutex *sync.Mutex

	// systems
	Systems []systems.System

	// components
	CNames    []components.NameComponent
	CImages   []components.ImageComponent
	CCollider []components.ColliderComponent
	CPlayer   []components.PlayerComponent

	// bit flags to quickly check if a given object has something
	cFlags []components.ComponentBit
}

// AddEntity adds an empty entity to the World
func (w *World) AddEntity() int {
	w.CNames = append(w.CNames, "")
	w.CImages = append(w.CImages, "")
	w.CCollider = append(w.CPositions, components.ColliderComponent{})
	w.CPlayer = append(w.CPlayer, components.PlayerComponent{})
	w.cFlags = append(w.cFlags, 0)
	id := len(w.cFlags) - 1

	return id
}

func (w *World) AddOrUpdateComponent(eid int, comp components.Component) {
	switch v := comp.(type) {
	case components.NameComponent:
		w.CNames[eid] = v
	case components.ImageComponent:
		w.CImages[eid] = v
	case components.ColliderComponent:
		w.CCollider[eid] = v
	case components.PlayerComponent:
		w.CPlayer[eid] = v
	}

	w.cFlags[eid] |= comp.Bit()
}

func (w *World) RemoveComponent(eid int, cid components.ComponentBit) {
	w.cFlags[eid] = (w.cFlags[eid] &^ cid)
}

func (w *World) AddSystem(s systems.System) {
	w.Systems = append(w.Systems, s)
}

func (w *World) Update() {
	for _, s := range w.Systems {
		s.Update()
	}
}
