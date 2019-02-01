package namereader

import (
	"bytes"
	"fmt"
	"testing"

	"github.com/chronojam/submariner/server/pkg/components"
	"github.com/chronojam/submariner/server/pkg/world"
)

func TestNameReader(t *testing.T) {
	w := world.New()
	for i := 0; i < 5; i++ {
		eid := w.AddEntity()
		w.AddOrUpdateComponent(eid, components.NameComponent(
			fmt.Sprintf("%d", i),
		))

		w.AddEntity()
	}
	var b bytes.Buffer
	w.AddSystem(New(w, &b))
	w.Update()
	if b.String() != "01234" {
		t.Fatalf("\nExpected: 01234\nActual: %s", b.String())
	}
}
