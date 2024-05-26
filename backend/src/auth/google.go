package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"

	"github.com/anthonyq98/lock-and-learn/src/config"
)

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received a request to GoogleLogin handler: %v\n", r)
	url := config.AppConfig.GoogleLoginConfig.AuthCodeURL("randomstate")
	log.Printf("Client ID: %s\n", config.AppConfig.GoogleLoginConfig.ClientID)
	log.Printf("url: %s\n", url)

	http.Redirect(w, r, url, http.StatusSeeOther)
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received a request to GoogleCallback handler: %v", r)
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
	log.Printf("userData:", string(userData))

	var googleUser GoogleUser
	err = json.Unmarshal(userData, &googleUser)
	if err != nil {
		http.Error(w, "JSON Unmarshal Failed", http.StatusInternalServerError)
		return
	}

	redirectURL := fmt.Sprintf(
		"http://localhost:3000/login/callback?id=%s&name=%s&email=%s",
		url.QueryEscape(googleUser.ID),
		url.QueryEscape(googleUser.Name),
		url.QueryEscape(googleUser.Email),
	)
	log.Printf("Redirecturl: %s\n", redirectURL)

	// Redirect to the user page with user data as query parameters
	http.Redirect(w, r, redirectURL, http.StatusSeeOther)
}

// Define a struct to parse the user data JSON response
type GoogleUser struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}
