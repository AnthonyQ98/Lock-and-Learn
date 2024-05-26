CREATE TABLE users (
  id   INTEGER PRIMARY KEY,
  oauth_id text NOT NULL,
  name text    NOT NULL,
  email  text NOT NULL,
  key text NOT NULL
);