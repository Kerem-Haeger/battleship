import {
    shipOrientation,
    playerShipCount,
    shipPosition,
} from './game.js'

import {
    isShipAtCell,
    switchTurn,
    canPlayerAttack
} from './utils.js';

// Highlighting cells on hover before placing ships

export let shipCellsToHighlight = []; // Store the cells to be highlighted
export let placedCells = []; // Store the cells that have ships placed

/**
 * Function to highlight the cells the user places ships on
 */
export function highlightUserCells() {
    document.getElementById("player-board").addEventListener("mousemove", (e) => {
        if (!e.target.classList.contains("cell")) return; // Ensure a cell is hovered

        // Ensure to only "preview" the placement, when the player still has ships to place
        if (playerShipCount >= 3) return;

        // Get the cell ID (e.g., a1)
        let cellId = e.target.id.replace("player-board-", "");
        let [row, col] = cellId.split(/(\d+)/);
        col = parseInt(col);

        // Clear previously highlighted cells (excluding placed ships)
        shipCellsToHighlight.forEach(cell => {
            if (!placedCells.includes(cell)) { // Don't clear cells where ships are placed
                let highlightedCell = document.getElementById(`player-board-${cell}`);
                if (highlightedCell) {
                    highlightedCell.style.backgroundColor = ""; // Reset the color
                };
            };
        });

        // Reset the array of highlighted cells
        shipCellsToHighlight = [];

        // Highlight cells based on orientation
        if (shipOrientation === "horizontal") {
            // Highlight 3 horizontal cells (even beyond the board)
            for (let i = 0; i < 3; i++) {
                let newCell = `${row}${col + i}`;
                shipCellsToHighlight.push(newCell);
                let cellToHighlight = document.getElementById(`player-board-${newCell}`);
                if (cellToHighlight && !placedCells.includes(newCell)) {
                    cellToHighlight.style.backgroundColor = "lightgray"; // Highlight potential cells
                };
            };
        } else if (shipOrientation === "vertical") {
            // Highlight 3 vertical cells (even beyond the board)
            let letters = "abcdefghij";
            let rowIndex = letters.indexOf(row);
            for (let i = 0; i < 3; i++) {
                let newRow = letters[rowIndex + i];
                let newCell = `${newRow}${col}`;
                shipCellsToHighlight.push(newCell);
                let cellToHighlight = document.getElementById(`player-board-${newCell}`);
                if (cellToHighlight && !placedCells.includes(newCell)) {
                    cellToHighlight.style.backgroundColor = "lightgray"; // Highlight potential cells
                };
            };
        };
    });

    // Reset all cells when mouse leaves the board
    document.getElementById("player-board").addEventListener("mouseleave", () => {
        // Only reset non-placed cells
        shipCellsToHighlight.forEach(cell => {
            if (!placedCells.includes(cell)) { // Don't clear placed ship cells
                let highlightedCell = document.getElementById(`player-board-${cell}`);
                if (highlightedCell) {
                    highlightedCell.style.backgroundColor = ""; // Reset color
                };
            };
        });
    });
};

/** 
 * Player attack function
 */
export function playerAttack() {
    if (!canPlayerAttack) return; // Prevent attack if it's not the player's turn

    document.getElementById("computer-board").addEventListener("click", playerAttackListener);
};

let hitCounterPlayer = 0; // Track cells hit by player

/**
 * Player attack event listener
 */
export function playerAttackListener(e) {
    if (!e.target.classList.contains("cell")) return; // Ensure a cell is clicked

    let cellId = e.target.id.replace("computer-board-", ""); // Extract ID without board prefix

    // Check if a ship is at the clicked cell
    if (isShipAtCell(cellId, shipPosition)) {
        console.log(`Hit! Ship found at ${cellId}`);
        e.target.style.backgroundColor = "red"; // Example hit effect
        hitCounterPlayer = hitCounterPlayer + 1;
        console.log(`Player has hit ${hitCounterPlayer} cells!`);

        // Track ships hit by player and end game (alert for now, call function later)
        if (hitCounterPlayer === 9) {
            alert("Player wins!");
        };

    } else {
        console.log(`Miss at ${cellId}`);
        e.target.style.backgroundColor = "gray"; // Example miss effect
    };

    switchTurn();
};