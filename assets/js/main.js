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



createBoard("player-board");
createBoard("computer-board");

computerPlaceShips();
colorShipCells("computer-board");

highlightUserCells();
userPlaceShips();