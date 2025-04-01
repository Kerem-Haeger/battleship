import {
    createBoard,
    colorShipCells // leave for now, but needs removing later
} from './ui.js';

import {
    computerPlaceShips,
    userPlaceShips
} from './game.js';

import {
    highlightUserCells
} from './events.js'

/**
 * On loading the user is presented with an obligatory modal to enter their name
 */
document.addEventListener("DOMContentLoaded", function () {
    let instructionModal = new bootstrap.Modal(document.getElementById("static-backdrop"));
    instructionModal.show();

    let gameTurn = document.getElementById("turn-button");
    gameTurn.style.visibility = "hidden";

    document.getElementById("got-it").addEventListener("click", (e) => {
        // These will be called when the player presses "Start" in the startup/instruction modal
        createBoard("player-board");
        createBoard("computer-board");
        computerPlaceShips();
        // This should be removed for the game, it is only for debugging!
        // colorShipCells("computer-board");
        instructionModal.hide();
        //gameTurn.style.visibility = "hidden"; // Hide the button until player is done placing ships
    });
});

highlightUserCells();
userPlaceShips();