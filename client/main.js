const URL = "https://teachablemachine.withgoogle.com/models/je3roTdIx/" // classified information

let model, webcam, labelContainer, maxPredictions

let email
let userName
let foodName

function inputData() {
    email = document.getElementById("emailText").value;
    document.getElementById("email").innerHTML = email;

    userName = document.getElementById("nameText").value;
    document.getElementById("name").innerHTML = userName;
  }

function request() {

    //var message = `Hello ${encodeURIComponent(userName)}, \n Your stats are below: \n test test test`
  var url = `http://localhost:8080/api/?email=${encodeURIComponent(email)}&name=${encodeURIComponent(userName)}&food-name=${encodeURIComponent(foodName)}`

  var request = new XMLHttpRequest()
  request.open("GET", url)
  request.onload = () => {
      var response = JSON.parse(request.responseText) 


      document.querySelector("#output").innerText = response.Calories

  }
  
  request.send()

}

async function init() {
    const modelURL = URL + "model.json"
    const metadataURL = URL + "metadata.json"
  
    model = await tmImage.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()
  
    const flip = true

    webcam = new tmImage.Webcam(200, 200, flip)
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

        if (prediction[0].probability.toFixed(2) == 0.85) {
            foodName = "Egg"
        }

        if (prediction[1].probability.toFixed(2) == 0.85) {
            foodName = "Cane"
        }

        if (prediction[3].probability.toFixed(2) == 0.85) {
            window.alert(predicton[2])
            foodName = "Yogurt"
        }
    }
}


// CHART
var data = [
    { y: '2014', a: 50, b: 90},
    { y: '2015', a: 65,  b: 75},
    { y: '2016', a: 50,  b: 50},
    { y: '2017', a: 75,  b: 60},
    { y: '2018', a: 80,  b: 65},
    { y: '2019', a: 90,  b: 70},
    { y: '2020', a: 100, b: 75},
    { y: '2021', a: 115, b: 75},
    { y: '2022', a: 120, b: 85},
    { y: '2023', a: 145, b: 85},
    { y: '2024', a: 160, b: 95}
  ],
  config = {
    data: data,
    xkey: 'y',
    ykeys: ['a', 'b'],
    labels: ['Total Income', 'Total Outcome'],
    fillOpacity: 0.6,
    hideHover: 'auto',
    behaveLikeLine: true,
    resize: true,
    pointFillColors:['#ffffff'],
    pointStrokeColors: ['black'],
    lineColors:['gray','red']
};
config.element = 'area-chart';
Morris.Area(config);
config.element = 'line-chart';
Morris.Line(config);
config.element = 'bar-chart';
Morris.Bar(config);
config.element = 'stacked';
config.stacked = true;
Morris.Bar(config);
Morris.Donut({
element: 'pie-chart',
data: [
  {label: "Friends", value: 30},
  {label: "Allies", value: 15},
  {label: "Enemies", value: 45},
  {label: "Neutral", value: 10}
]
});
