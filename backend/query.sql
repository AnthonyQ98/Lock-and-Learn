-- name: GetUser :one
SELECT * FROM users
WHERE oauth_id = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY oauth_id;

-- name: CreateUser :one
INSERT INTO users (
  oauth_id, key
) VALUES (
  ?, ?
)
RETURNING *;

-- name: UpdateUser :exec
UPDATE users
set key = ?
WHERE oauth_id = ?;

-- name: DeleteUser :exec
DELETE FROM users
WHERE oauth_id = ?;

-- name: GetResult :many
SELECT * FROM results
WHERE oauth_id = ?;

-- name: ListResults :many
SELECT * FROM results
ORDER BY result_start_time;

-- name: CreateResult :one
INSERT INTO results (
  oauth_id, result, result_start_time, quiz_type
) VALUES (
  ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateResult :exec
UPDATE results
set result = ?
WHERE oauth_id = ?;

-- name: DeleteResult :exec
DELETE FROM results
WHERE oauth_id = ?;