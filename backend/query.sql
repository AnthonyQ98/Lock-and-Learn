-- name: GetUser :one
SELECT * FROM users
WHERE oauth_id = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY name;

-- name: CreateUser :one
INSERT INTO users (
  name, email, key
) VALUES (
  ?, ?, ?
)
RETURNING *;

-- name: UpdateUser :exec
UPDATE users
set name = ?,
email = ?,
key = ?
WHERE oauth_id = ?;

-- name: DeleteUser :exec
DELETE FROM users
WHERE oauth_id = ?;