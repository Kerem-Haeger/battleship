import {
    shipPosition
} from './game.js';

let cells = []; // Array to store references to the cells

export function createBoard(boardId) {
    const board = document.getElementById(boardId);
    const letters = "abcdefghij";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); // Add the class cell so it can be styled by CSS

            // Add a board-specific prefix to the cell ID (e.g., "player-" or "pc-")
            cell.id = `${boardId}-${letters[row]}${col}`; // e.g., player-a1, pc-a1
            board.appendChild(cell);
            // Store the cell in the array
            cells.push(cell);
        };
    };
};

/**
 * Function to color ship cells
 * 
 * this is temporary but might be called when the game is over to reveal the board
 */
export function colorShipCells(boardId) {
    const board = document.getElementById(boardId);

    // Loop over the shipPosition array, which contains the ships' coordinates
    shipPosition.forEach(ship => {
        ship.forEach(cellId => {
            // Update the cell ID to include the boardId prefix
            const cell = document.getElementById(`${boardId}-${cellId}`);

            // Only color the cell if it's part of the specified board
            if (cell && board.contains(cell)) {
                cell.style.backgroundColor = "red";
            };
        });
    });
};