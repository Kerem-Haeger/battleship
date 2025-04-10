import {
    createBoard,
    createBoardLabels,
    adjustUIForScreenSize,
} from './ui.js';

import {
    computerPlaceShips,
    userPlaceShips,
    resetGame
} from './game.js';

import {
    highlightUserCells,
    resetHitCounter
} from './events.js';

import {
    resetCurrentTurn,
    updatePrompt
} from './utils.js';

/**
 * On loading the user is presented with an obligatory modal with instructions
 */
document.addEventListener("DOMContentLoaded", function () {
    let instructionModal = new bootstrap.Modal(document.getElementById("static-backdrop"));
    adjustUIForScreenSize();
    instructionModal.show();

    document.getElementById("got-it").addEventListener("click", (e) => {
        // These will be called when the player presses "Start" in the startup/instruction modal
        createBoard("player-board");
        createBoardLabels(document.querySelector("#player-board").parentElement);

        computerPlaceShips();

        instructionModal.hide();
        highlightUserCells();
        userPlaceShips();
    });
});

// When the game is over, the player can restart/reset the game
document.getElementById("reset-button").addEventListener("click", () => {
    // Clear the boards by removing all child elements
    document.getElementById("player-board").innerHTML = '';
    document.getElementById("computer-board").innerHTML = '';
    document.getElementById("computer-wrapper").style.visibility = "hidden";

    // Recreate the player board
    createBoard("player-board");

    // Reset all variables to restart game
    resetGame();
    resetHitCounter();
    resetCurrentTurn();

    // Computer places ships again
    computerPlaceShips();

    // Hide the modal
    const gameOverModal = bootstrap.Modal.getInstance(document.getElementById("game-over"));
    gameOverModal.hide();

    // Re-init game flow
    highlightUserCells();
    userPlaceShips();
    updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");
});