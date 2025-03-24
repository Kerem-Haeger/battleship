import {
    createBoard,
    colorShipCells
} from './ui.js';

import {
    computerPlaceShips
} from './game.js';


createBoard("player-board");
createBoard("computer-board");

computerPlaceShips();
colorShipCells("computer-board");