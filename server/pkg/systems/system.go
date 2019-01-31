package systems

type System interface {
	// Update() Asks this system to perform an update loop
	Update()
}
