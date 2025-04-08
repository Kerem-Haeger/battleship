import {
    shipPosition
} from './game.js';

import {
    updatePrompt
} from './utils.js'

export let cells = []; // Array to store references to the cells

/**
 * Function to create the playing boards
 */
export function createBoard(boardId) {
    const board = document.getElementById(boardId);

    // Make board programmatically focusable
    board.setAttribute("tabindex", "-1");

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
 * Creates the legend for the boards
 */
export function createBoardLabels(wrapperElement) {
    const topLabels = wrapperElement.querySelector(".board-labels-top");
    const leftLabels = wrapperElement.querySelector(".board-labels-left");

    const letters = "ABCDEFGHIJ";

    // Check if labels have already been created
    if (topLabels.children.length > 0 || leftLabels.children.length > 0) {
        return;
    };

    // Create top labels (1 to 10)
    for (let i = 1; i <= 10; i++) {
        const label = document.createElement("div");
        label.textContent = i;
        topLabels.appendChild(label);
    };

    // Create left labels (A to J)
    for (let i = 0; i < 10; i++) {
        const label = document.createElement("div");
        label.textContent = letters[i];
        leftLabels.appendChild(label);
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

export function adjustUIForScreenSize() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        let modalBody = document.getElementById("place-ships");
        if (modalBody) modalBody.innerHTML = "1 - Place your ships! Use a <strong><em>long press</strong></em> to rotate your ships.";

        updatePrompt("Tap to place your ships. Long press to rotate.");
    } else {
        updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");
    }
}