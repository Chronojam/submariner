package loader

import (
	"log"
	"sync"

	"github.com/chronojam/submariner/server/pkg/entity"
	"github.com/chronojam/submariner/server/pkg/systems"
)

func New() *world {
	return &world{
		Entities: []*entity.Entity{},
		systems:  []systems.System{},
		mutex:    &sync.Mutex{},
	}
}

type world struct {
	Entities []*entity.Entity `json:"Entities"`
	systems  []systems.System
	mutex    *sync.Mutex
}

func (w *world) AddEntity(e *entity.Entity) int {
	// Append is considered to be slightly slower than assign, but we can have dynamically sized
	// slices, so lets use that.
	w.mutex.Lock()
	w.Entities = append(w.Entities, e)
	w.mutex.Unlock()

	for _, s := range w.systems {
		if err := s.Register(e); err != nil {
			log.Printf("errored while registering system")
		}
	}
	return len(w.Entities)
}

func (w *world) AddSystem(s systems.System) {
	// Adding systems is expensive, so only do it at game initialization
	w.mutex.Lock()
	for i := 0; i < len(w.Entities); i++ {
		for _, v := range w.Entities[i].Components {
			// Decide if we're intrested in this component
			if err := s.Register(v); err != nil {
				log.Printf("errored while registering system")
			}
		}
	}
	// System is upto date, lets add it.
	w.systems = append(w.systems, s)
	w.mutex.Unlock()
}
