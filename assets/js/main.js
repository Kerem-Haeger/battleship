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

import {
    updatePrompt
} from './utils.js';

/**
 * On loading the user is presented with an obligatory modal with instructions
 */
document.addEventListener("DOMContentLoaded", function () {
    let instructionModal = new bootstrap.Modal(document.getElementById("static-backdrop"));
    instructionModal.show();

    document.getElementById("got-it").addEventListener("click", (e) => {
        // These will be called when the player presses "Start" in the startup/instruction modal
        createBoard("player-board");
        // Don't create computer board yet, wait for player to place ships
        // Replace with a UX element / hint
        // createBoard("computer-board");
        computerPlaceShips();
        // This should be removed for the game, it is only for debugging!
        // colorShipCells("computer-board");
        instructionModal.hide();
        highlightUserCells();
        userPlaceShips();
        updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");
    });
});