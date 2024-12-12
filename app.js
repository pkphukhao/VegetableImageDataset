// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}



// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {

        const className = prediction[i].className;
        const probability = prediction[i].probability;

        const predictionContainer = document.createElement("div");
        predictionContainer.className = "progress-bar-container";

        const label = document.createElement("div");
        label.textContent = className;
        label.style.fontWeight = "bold";
        label.style.marginBottom = "5px";

        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";

        const progressBarFill = document.createElement("div");
        progressBarFill.className = "progress-bar-fill";
        progressBarFill.style.width = (probability * 100).toFixed(2)+"%";

        //Appended
        progressBar.appendChild(progressBarFill);
        const progressText = document.createElement("div");
        progressText.className = "progress-text";
        progressText.textContent = (probability * 100).toFixed(2) + "%";

        predictionContainer.appendChild(label);
        predictionContainer.appendChild(progressBar);
        predictionContainer.appendChild(progressText);


        labelContainer.appendChild(predictionContainer);

    }

    
}
