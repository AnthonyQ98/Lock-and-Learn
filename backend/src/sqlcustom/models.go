// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package sqlcustom

import ()

type Result struct {
	ID              int64
	ResultStartTime string
	Result          string
	OauthID         string
	QuizType        string
}

type User struct {
	ID      int64
	OauthID string
	Key     []byte
}
