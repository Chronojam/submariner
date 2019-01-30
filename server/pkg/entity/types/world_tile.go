package types

import (
	"github.com/SolarLune/resolv/resolv"
)

type WorldTile struct {
	Rect    resolv.Rectangle `json:"rect"`
	Texture string           `json:"texture"`
}
