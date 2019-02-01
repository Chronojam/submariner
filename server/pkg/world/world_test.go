package world

import (
	"testing"

	"github.com/chronojam/submariner/server/pkg/components"
)

func TestAddEntityAndComponent(t *testing.T) {
	w := New()
	eid := 0
	t.Run("AddEntity", func(t *testing.T) {
		eid = w.AddEntity()
	})

	comp := components.NameComponent("HelloWorld")
	t.Run("AddComponent", func(t *testing.T) {
		w.AddOrUpdateComponent(eid, comp)
		if w.cFlags[eid] != 2 {
			t.Fail()
		}
	})

	t.Run("RemoveComponent", func(t *testing.T) {
		w.RemoveComponent(eid, components.NAME)
		if w.cFlags[eid] != 0 {
			t.Fatalf("%d != 0", w.cFlags[eid])
		}
	})
}

func BenchmarkCreationAndUpdate(b *testing.B) {
	w := New()
	b.Run("BenchmarkAddEntity", func(b *testing.B) {
		b.N = 100000
		for i := 0; i < b.N; i++ {
			w.AddEntity()
		}
	})

	compArr := []components.Component{}
	b.Run("BenchmarkCreateComponent", func(b *testing.B) {
		b.N = 100000
		for i := 0; i < b.N; i++ {
			compArr = append(compArr, components.NameComponent("Component-Test"))
		}
	})

	b.Run("BenchmarkAddComponent", func(b *testing.B) {
		b.N = 10000
		for i := 0; i < b.N; i++ {
			w.AddOrUpdateComponent(i, compArr[i])
		}
	})
}
