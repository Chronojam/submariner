package loader

import (
	"testing"

	"github.com/chronojam/submariner/server/pkg/entity"
)

type dummySystem struct{}

func (d *dummySystem) Register(interface{}) error {
	return nil
}
func BenchmarkEntityAdd(b *testing.B) {
	b.N = 1000000
	w := New()
	for i := 0; i < b.N; i++ {
		_ = w.AddEntity(&entity.Entity{})
	}
}

func BenchmarkSystemAddSingle(b *testing.B) {
	b.N = 1
	w := New()
	for i := 0; i < b.N; i++ {
		w.AddSystem(&dummySystem{})
	}
}

func BenchmarkSystemAddMultipleWithEntitiesAfter(b *testing.B) {
	b.N = 1
	w := New()
	for i := 0; i < 50; i++ {
		_ = w.AddEntity(&entity.Entity{
			Components: map[string]interface{}{
				"Hello": "hi",
			},
		})
	}

	for i := 0; i < b.N; i++ {
		w.AddSystem(&dummySystem{})
	}
}
func BenchmarkSystemAddMultipleWithEntitiesBefore(b *testing.B) {
	b.N = 50
	w := New()

	for i := 0; i < 1; i++ {
		w.AddSystem(&dummySystem{})
	}

	for i := 0; i < b.N; i++ {
		_ = w.AddEntity(&entity.Entity{
			Components: map[string]interface{}{
				"Hello": "hi",
			},
		})
	}
}
