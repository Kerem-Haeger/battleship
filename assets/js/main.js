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

// Create the player and computer boards
createBoard("player-board");
createBoard("computer-board");

// Add event listeners (click, keypress, right-click)
addEventListeners();

// Start game logic
startGame();
computerPlaceShips();
colorShipCells("computer-board");