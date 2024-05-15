let finalTranscript = "";
let synth = window.speechSynthesis;
let speaker = document.getElementById("speaker");

function startDictation() {
    // Get the button element
    let button = document.getElementById("start-button");

    if (window.hasOwnProperty("webkitSpeechRecognition")) {
        let recognition = new webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.lang = "en-US";
        recognition.start();

        // Change the button text to "Listening..."
        button.textContent = "Listening...";

        recognition.onresult = function (e) {
            let finalTranscript = e.results[0][0].transcript;
            recognition.stop();
            // Change the button text back to "Start Dictation"
            button.textContent = "Start Dictation";
            // Send the transcript to the server
            sendToServer(finalTranscript);
        };

        recognition.onerror = function (e) {
            recognition.stop();
        };
    }
}

function sendToServer(message) {
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
    })
        .then((response) => response.json())
        .then((data) => {
            speak(data.response);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

let stopButton = document.getElementById("stopButton");

function speak(text = "") {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }
    if (text !== "") {
        let utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
        speaker.style.visibility = "visible";
        stopButton.style.visibility = "visible"; // make the stop button visible
        utterThis.onend = function () {
            speaker.style.visibility = "hidden";
            stopButton.style.visibility = "hidden"; // hide the stop button
        };
    }
}

stopButton.addEventListener("click", function () {
    synth.cancel(); // stop the speech
    this.style.visibility = "hidden"; // hide the stop button
    speaker.style.visibility = "hidden"; // hide the speaker icon
});