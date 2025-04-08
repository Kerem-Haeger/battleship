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
    if (board) {
        board.setAttribute("tabindex", "-1");
    };

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

export function adjustUIForScreenSize() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let modalBody = document.getElementById("place-ships");

    if (isMobile) {
        if (modalBody) modalBody.innerHTML = "1 - Place your ships! Use a <strong><em>long press</strong></em> to rotate your ships.";

        updatePrompt("Tap to place your ships. Long press to rotate.");
    } else {
        if (modalBody) modalBody.innerHTML = "1 - Place your ships! <strong><em>Left clicking</em></strong> on your board places a ship, <strong><em>right clicking</em></strong> changes orientation (horizontal/vertical)";
        updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");
    };
};