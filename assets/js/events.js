import {
    shipOrientation,
    playerShipCount,
    shipPosition,
    computerPlaceShips,
    userPlaceShips,
    hitCounterComputer,
    guessedCells,
    priorityTargets,
    currentHitChain,
    hitShipDirection,
} from './game.js'

import {
    isShipAtCell,
    switchTurn,
    canPlayerAttack,
    updatePrompt,
    currentTurn
} from './utils.js';

import {
    createBoard
} from './ui.js'

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

export let hitCounterPlayer = 0; // Track cells hit by player

/**
 * Player attack event listener
 */
export function playerAttackListener(e) {
    if (!e.target.classList.contains("cell")) return; // Ensure a cell is clicked

    // Prevent clicking the same cell twice
    if (e.target.style.backgroundColor === "red" || e.target.style.backgroundColor === "gray") {
        alert("Cell already clicked. Choose another cell.");
        return; // Exit the function to prevent duplicate clicks
    };

    let cellId = e.target.id.replace("computer-board-", ""); // Extract ID without board prefix

    // Check if a ship is at the clicked cell
    if (isShipAtCell(cellId, shipPosition)) {
        console.log(`Hit! Ship found at ${cellId}`);
        e.target.style.backgroundColor = "red"; // Example hit effect
        hitCounterPlayer++;
        console.log(`Player has hit ${hitCounterPlayer} cells!`);

        // Track ships hit by player and end game
        if (hitCounterPlayer === 9) {
            let gameOverModal = new bootstrap.Modal(document.getElementById("game-over"));
            gameOverModal.show();
            // Get the game board containers by their IDs
            document.getElementById("show-result").innerText = "Congratulations, you won!";
            let playerBoard = document.getElementById('player-board');
            let computerBoard = document.getElementById('computer-board');

            // Clear the boards by removing all child elements
            playerBoard.innerHTML = '';
            computerBoard.innerHTML = '';

            // Add listener for modal close and reset
            document.getElementById("reset-button").addEventListener("click", (e) => {
                // These will be called when the player presses "Play again" in the game over modal
                createBoard("player-board");

                computerPlaceShips();

                gameOverModal.hide();
                highlightUserCells();
                userPlaceShips();
                updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");
                // need to still reset all variables! put all this in a function instead of doing it here!
                hitCounterPlayer = 0;
                hitCounterComputer = 0;
                guessedCells = new Set();
                priorityTargets = [];
                currentHitChain = [];
                hitShipDirection = "";
                currentTurn = "player";
                playerShipCount = 0;
                shipPosition = [];
            });
        };

    } else {
        console.log(`Miss at ${cellId}`);
        e.target.style.backgroundColor = "gray"; // Example miss effect
    };

    switchTurn();
};