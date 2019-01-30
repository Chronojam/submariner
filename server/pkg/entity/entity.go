package entity

type Entity struct {
	Components map[string]interface{} `json:"components"`
}

func (e *Entity) AddComponent() {

}
