import {
    createBoard,
    createBoardLabels,
    adjustUIForScreenSize,
} from './ui.js';

import {
    computerPlaceShips,
    userPlaceShips
} from './game.js';

import {
    highlightUserCells
} from './events.js'

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