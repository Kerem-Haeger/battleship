import {
    createBoard,
    colorShipCells,
    updateHighlightedCells
} from './ui.js';
import {
    startGame,
    computerPlaceShips
} from './game.js';
import {
    addEventListeners
} from './events.js';

// Initialize the game boards
createBoard("player-board");
createBoard("computer-board");

// Add event listeners (click, keypress, right-click)
addEventListeners();

// Trigger modal on page load (to ask for player name)
document.addEventListener("DOMContentLoaded", function () {
    let nameModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    nameModal.show(); // Show the modal when the page loads
    document.getElementById("turnButton").disabled = true; // Disable the start button until ships are placed
});

// Update highlighted cells based on the current ship orientation
updateHighlightedCells(shipOrientation);

// For toggling the ship orientation on right-click
document.getElementById("player-board").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal"; // Toggle orientation
    console.log("Orientation switched to:", shipOrientation);

    // After switching orientation, update highlighted cells based on new orientation
    updateHighlightedCells(shipOrientation);
});