const URL = "https://teachablemachine.withgoogle.com/models/je3roTdIx/"

let model, webcam, labelContainer, maxPredictions

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
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2)
        labelContainer.childNodes[i].innerHTML = classPrediction
    }
}

//CHART
var dData = function() {
    return Math.round(Math.random() * 90) + 10
  }
  
  var barChartData = {
    labels: ["dD 1", "dD 2", "dD 3", "dD 4", "dD 5", "dD 6", "dD 7", "dD 8", "dD 9", "dD 10"],
    datasets: [{
      fillColor: "rgba(0,60,100,1)",
      strokeColor: "black",
      data: [dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData(), dData()]
    }]
  }
  
  var index = 11;
  var ctx = document.getElementById("canvas").getContext("2d");
  var barChartDemo = new Chart(ctx).Bar(barChartData, {
    responsive: true,
    barValueSpacing: 2
  });
  setInterval(function() {
    barChartDemo.removeData()
    barChartDemo.addData([dData()], "dD " + index)
    index++
  }, 3000)
