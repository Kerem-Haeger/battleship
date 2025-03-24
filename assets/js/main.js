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
colorShipCells("computer-board");

highlightUserCells();
userPlaceShips();