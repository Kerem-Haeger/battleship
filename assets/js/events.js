import {
    startGame
} from './game.js';
import {
    updateHighlightedCells
} from './ui.js';

// Function to add event listeners
export function addEventListeners() {
    document.getElementById("startButton").addEventListener("click", startGame);

    // Toggle ship orientation on right-click
    document.getElementById("player-board").addEventListener("contextmenu", (e) => {
        e.preventDefault();
        shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal";
        console.log("Orientation switched to:", shipOrientation);
        updateHighlightedCells(shipOrientation);
    });

    // Listen for name input to enable the start button
    document.getElementById("player-name").addEventListener("input", function () {
        document.querySelector(".start-button").disabled = this.value.trim() === "";
    });

    // Button click to disable and change text
    document.getElementById("turnButton").addEventListener("click", function () {
        let button = this;
        button.disabled = true;

        setTimeout(() => {
            button.innerText = "End Turn";
            button.disabled = false;
        }, 1000);
    });
}