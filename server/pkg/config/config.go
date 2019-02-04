package config

// Config defines the primary configuration for the server
type Config struct {
	IP             string   `json:"ip"`
	Port           int      `json:"port"`
	AllowedOrigins []string `json:"allowedOrigins"`
}
