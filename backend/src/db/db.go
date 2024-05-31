package db

import (
	"database/sql"
	"log"

	"github.com/anthonyq98/lock-and-learn/src/sqlcustom" // Adjust import path
	_ "github.com/mattn/go-sqlite3"
)

// Global database variable
var Queries *sqlcustom.Queries

// Initialize the database
func InitDB(dataSourceName string) {
	// Open the database connection
	database, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Initialize the sqlcustom.Queries instance
	Queries = sqlcustom.New(database)
}
