package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
	"strconv"

	"github.com/gorilla/mux"
)

var usersNutrience = map[string]float64{"Calories": 0, "Protein": 0, "Fat": 0, "Sugar": 0, "Vitamin C": 0}

var egg = map[string]float64{"Calories": 75, "Protein": 7, "Fat": 5, "Sugar": 0, "Vitamin C": 0}
var cane = map[string]float64{"Calories": 60, "Protein": 0, "Fat": 0, "Sugar": 10, "Vitamin C": 0}
var yogurt = map[string]float64{"Calories": 90, "Protein": 4, "Fat": 1, "Sugar": 12, "Vitamin C": 0.0071}

func main() {
	fmt.Println("Server started...")
	fmt.Println(" * Running on http://127.0.0.1:8080/")
	fmt.Println(" * IP: localhost")
	fmt.Println(" * Port: 8080")

	r := mux.NewRouter()

	r.HandleFunc("/api/", getFoodResponse).Queries("email", "{email}", "name", "{name}", "food-name", "{food}").Methods("GET")


	buildHandler := http.FileServer(http.Dir("../client"))

	r.PathPrefix("/").Handler(buildHandler)

	http.ListenAndServe(":8080", r)
}

func getFoodResponse(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Println("GET recieved from path " + r.URL.Path)

	params := mux.Vars(r)

	fmt.Println(params["food"])

	if params["food"] == "Egg" {
		for key, value := range egg {
			usersNutrience[key] += value
		}
	} else if params["food"] == "Cane" {
		for key, value := range cane {
			usersNutrience[key] += value
		}
	} else if params["food"] == "Yogurt" {
		for key, value := range yogurt {
			usersNutrience[key] += value
		}
	}

	sendEmail(params["email"], map2string(usersNutrience))

	json.NewEncoder(w).Encode(usersNutrience)
}

func sendEmail(to, message string) {

	from := "johnlinstest@gmail.com"
	pass := "kqu3-b@vFu_/P4W7"

	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: Nutrience Status\n\n" +
		message

	err := smtp.SendMail("smtp.gmail.com:587",
		smtp.PlainAuth("", from, pass, "smtp.gmail.com"),
		from, []string{to}, []byte(msg))

	checkError(err)

	fmt.Println("Message Sent!")
}

func map2string(input map[string]float64) string {
	var output string
	for key, value := range input {
		output += key + " : " + strconv.FormatFloat(value, 'f', 6, 64) + "\n"
	}
	return output
}

func checkError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}
