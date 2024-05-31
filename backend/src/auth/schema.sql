CREATE TABLE users (
  id   INTEGER PRIMARY KEY,
  oauth_id text NOT NULL,
  key BLOB NOT NULL
);

CREATE TABLE results (
  id INTEGER PRIMARY KEY,
  result_start_time text NOT NULL,
  result text NOT NULL,
  oauth_id text NOT NULL,
  quiz_type text NOT NULL
)