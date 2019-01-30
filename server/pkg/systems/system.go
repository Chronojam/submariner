package systems

type System interface {
	Register(interface{}) error
}
