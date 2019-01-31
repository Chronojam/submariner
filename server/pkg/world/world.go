package world

import (
	"sync"

	"github.com/chronojam/submariner/server/pkg/components"
)

func New() *world {
	return &world{
		entityMutex: &sync.Mutex{},
	}
}

type world struct {
	entityMutex *sync.Mutex

	cNames []components.Name

	// bit flags to quickly check if a given object has something
	cFlags []int
}

// AddEntity adds an empty entity to the world
func (w *world) AddEntity() int {
	w.cNames = append(w.cNames, "")
	w.cFlags = append(w.cFlags, 0)
	id := len(w.cFlags) - 1

	return id
}

func (w *world) AddComponent(eid int, comp components.Component) {
	switch v := comp.(type) {
	case components.Name:
		w.cNames[eid] = v
	}

	w.cFlags[eid] |= comp.Type()
}

func (w *world) RemoveComponent(eid int, cid int) {
	switch cid {
	case components.NAME:
		if len(w.cNames) == eid {
			// We're the last item
			w.cNames = w.cNames[:eid]
			break
		}
		// We're somewhere in the middle of the slice.
		w.cNames = append(w.cNames[:eid], w.cNames[eid+1:]...)
	}
	w.cFlags[eid] = (w.cFlags[eid] &^ cid)
}

func (w *world) FindAllEntitiesByComponentType(cid int) []int {
	eids := []int{}
	for i := range w.cFlags {
		if (uint(w.cFlags[i]) & (1<<uint(cid) - 1)) != 0 {
			eids = append(eids, i)
		}
	}
	return eids
}
