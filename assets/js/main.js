import {
    createBoard,
    colorShipCells
} from './ui.js';

import {
    computerPlaceShips,
    userPlaceShips
} from './game.js';

import {
    highlightUserCells
} from './events.js'



// These will be called when the player presses "Start" in the startup/instruction modal
createBoard("player-board");
createBoard("computer-board");

computerPlaceShips();
// This should be removed for the game, it is only for debugging!
colorShipCells("computer-board");

highlightUserCells();
userPlaceShips();