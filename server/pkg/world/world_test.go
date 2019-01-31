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

	comp := components.Name("HelloWorld")
	t.Run("AddComponent", func(t *testing.T) {
		w.AddComponent(eid, comp)
		if w.cFlags[eid] != 2 {
			t.Fail()
		}
		if w.cNames[eid] != comp {
			t.Fail()
		}
	})

	t.Run("RemoveComponent", func(t *testing.T) {
		w.RemoveComponent(eid, components.NAME)
		if w.cFlags[eid] != 0 {
			t.Fatalf("%d != 0", w.cFlags[eid])
		}
		if len(w.cNames) >= 1 {
			t.Fail()
		}
	})
}

func TestFindEntitiesByComponent(t *testing.T) {
	w := New()
	for i := 0; i < 10; i++ {
		w.AddEntity()
	}
	for i := 0; i < 5; i++ {
		eid := w.AddEntity()
		w.AddComponent(eid, components.Name("FooBar"))
	}
	eids := w.FindAllEntitiesByComponentType(components.NAME)
	if len(eids) != 5 {
		t.Fatalf("\nExpected: 5\nActual: %d", len(eids))
	}
}

func BenchmarkFindAllEntitiesByComponentType(b *testing.B) {
	w := New()
	b.N = 1000
	for i := 0; i < 100000; i++ {
		w.AddEntity()
	}
	for i := 0; i < 50000; i++ {
		eid := w.AddEntity()
		w.AddComponent(eid, components.Name("FooBar"))
	}
	for i := 0; i < b.N; i++ {
		w.FindAllEntitiesByComponentType(components.NAME)
	}
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
			compArr = append(compArr, components.Name("Component-Test"))
		}
	})

	b.Run("BenchmarkAddComponent", func(b *testing.B) {
		b.N = 10000
		for i := 0; i < b.N; i++ {
			w.AddComponent(i, compArr[i])
		}
	})
}
