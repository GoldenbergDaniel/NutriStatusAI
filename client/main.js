const URL = "https://teachablemachine.withgoogle.com/models/je3roTdIx/" // classified information

let model, webcam, labelContainer, maxPredictions

let email
let userName
let foodName

function inputData() {
    email = document.getElementById("emailText").value;
    document.getElementById("email").querySelector("span").innerHTML = email;

    userName = document.getElementById("nameText").value;
    document.getElementById("name").querySelector("span").innerHTML = userName;
  }

function request() {
  var url = `http://localhost:8080/api/?email=${encodeURIComponent(email)}&name=${encodeURIComponent(userName)}&food-name=${encodeURIComponent(foodName)}`

  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onload = () => {
    var response = JSON.parse(request.responseText)

    let nutrition = [0, 0, 0, 0, 0]

    nutrition[0] = parseFloat(response.Calories.toFixed(2))
    nutrition[1] = parseFloat(response.Protein.toFixed(2))
    nutrition[2] = parseFloat(response.Fat.toFixed(2))
    nutrition[3] = parseFloat(response.Sugar.toFixed(2))
    nutrition[4] = parseFloat(response.VitaminC.toFixed(2))

    var x = d3.scale.linear().domain([0, d3.max(nutrition)]).range([0, 420]);

    d3.select(".chart")
        .selectAll("div")
        .data(nutrition)
        .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });
  }
  
  request.send()
}

async function init() {
    const modelURL = URL + "model.json"
    const metadataURL = URL + "metadata.json"
  
    model = await tmImage.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()
  
    const flip = true

    webcam = new tmImage.Webcam(400, 400, flip)
    await webcam.setup()
    await webcam.play()

    window.requestAnimationFrame(loop)

    document.getElementById("webcam-container").appendChild(webcam.canvas)

    labelContainer = document.getElementById("label-container")

    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"))
    }
}

async function loop() {
    webcam.update() 
    await predict()
    window.requestAnimationFrame(loop)
}

async function predict() {
    const prediction = await model.predict(webcam.canvas)

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2)

        labelContainer.childNodes[i].innerHTML = classPrediction

        if (prediction[0].probability.toFixed(2) >= 0.85) {
            foodName = "Egg"
        }

        if (prediction[1].probability.toFixed(2) >= 0.85) {
            foodName = "Cane"
        }

        if (prediction[3].probability.toFixed(2) >= 0.85) {
            window.alert(predicton[2])
            foodName = "Yogurt"
        }
    }
}
