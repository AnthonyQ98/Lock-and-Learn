// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package sqlcustom

import ()

type User struct {
	ID      int64
	OauthID string
	Name    string
	Email   string
	Key     string
}