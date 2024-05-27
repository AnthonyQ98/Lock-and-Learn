package auth

import (
	"context"
	"database/sql"
	_ "embed"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"reflect"
	"time"

	_ "github.com/mattn/go-sqlite3"

	"github.com/anthonyq98/lock-and-learn/src/config"
	"github.com/anthonyq98/lock-and-learn/src/sqlcustom"
	"github.com/anthonyq98/lock-and-learn/src/utils"
)

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	log.Println("Received a request to GoogleLogin handler")
	url := config.AppConfig.GoogleLoginConfig.AuthCodeURL("randomstate")

	http.Redirect(w, r, url, http.StatusSeeOther)
}

//go:embed schema.sql
var ddl string

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	log.Println("Received a request to GoogleCallback handler")
	state := r.URL.Query().Get("state")
	if state != "randomstate" {
		http.Error(w, "States don't Match!!", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")

	googlecon := config.GoogleConfig()

	token, err := googlecon.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Code-Token Exchange Failed", http.StatusInternalServerError)
		return
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		http.Error(w, "User Data Fetch Failed", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "JSON Parsing Failed", http.StatusInternalServerError)
		return
	}

	var googleUser GoogleUser
	err = json.Unmarshal(userData, &googleUser)
	if err != nil {
		http.Error(w, "JSON Unmarshal Failed", http.StatusInternalServerError)
		return
	}

	// Create a context with a timeout for querying the user
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Printf("attempting to read db file.")
	db, err := sql.Open("sqlite3", "my.db")
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("db file successfully found & read.")

	// create tables
	if _, err := db.ExecContext(ctx, ddl); err != nil {
		log.Printf("error in execcontext: %v", err)
		return
	}

	queries := sqlcustom.New(db)

	// Check if user is in db
	user, err := queries.GetUser(ctx, googleUser.ID)
	if err != nil {
		log.Printf("error fetching user from db : %v", err)
	}

	var key string
	if reflect.ValueOf(user).IsZero() {
		// if user is empty
		newUser := sqlcustom.CreateUserParams{OauthID: googleUser.ID, Key: string(utils.GenerateAESKey())}
		key = newUser.Key
		_, err = queries.CreateUser(ctx, newUser)
		if err != nil {
			log.Printf("error with user creation: %v", err)
			return
		}
		log.Printf("user added to the database: %v", newUser.OauthID)
	} else {
		key = user.Key
	}

	redirectURL := fmt.Sprintf(
		"http://localhost:3000/login/callback?id=%s&name=%s&email=%s&key=%s",
		url.QueryEscape(googleUser.ID),
		url.QueryEscape(googleUser.Name),
		url.QueryEscape(googleUser.Email),
		url.QueryEscape(key),
	)

	log.Printf("redirecturl: %v", redirectURL)

	// Redirect to the user page with user data as query parameters
	http.Redirect(w, r, redirectURL, http.StatusSeeOther)
}

// Define a struct to parse the user data JSON response
type GoogleUser struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}
