package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("Server started...")
	fmt.Println(" * Running on http://127.0.0.1:8080/")
	fmt.Println(" * IP: localhost")
	fmt.Println(" * Port: 8080")

	r := mux.NewRouter()

	r.HandleFunc("/api/", getFoodResponse).Queries("email", "{email}", "name", "{name}", "food-name", "{food}").Methods("GET")

	buildHandler := http.FileServer(http.Dir("./client/"))
	r.PathPrefix("/").Handler(buildHandler)

	http.ListenAndServe(":8080", r)
}

func getFoodResponse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Println("GET recieved from path " + r.URL.Path)

	params := mux.Vars(r)

	json.NewEncoder(w).Encode(params)
}

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}
