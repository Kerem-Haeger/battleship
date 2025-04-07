import {
    isValidPlacement,
    hasOverlapOrTouch,
    isShipAtCell,
    getRandomCell,
    updatePrompt,
    resetCurrentTurn
} from './utils.js'

import {
    placedCells,
    playerAttack,
    highlightUserCells,
    resetHitCounter
} from './events.js';

import {
    createBoard
} from './ui.js'

export let shipPosition = []; // This will store the Computer's ship starting points
export let occupiedCells = new Set(); // To store all occupied cells (for checking overlap and proximity)
let newShipComputer

/**
 * Computer to place ships at random
 * 
 * Ships can only be placed if they fully fit on the board (placed is false by default)
 */
export function computerPlaceShips() { // To add later: difficulty can be changed with more or less ships
    for (let i = 0; i <= 2; i++) { // Loop for 3 ships
        let shipDirection = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
        let placed = false; // Flag to track whether the ship was successfully placed

        // Try until a valid position is found
        while (!placed) {
            let horizontal = letters[Math.floor(Math.random() * 10)];
            let vertical = Math.floor(Math.random() * 10) + 1;

            if (shipDirection === 0) { // Horizontal ship placement
                let horizontalIndex = letters.indexOf(horizontal);

                // Ensure the horizontal ship doesn't go out of bounds (must fit 3 tiles)
                if (horizontalIndex <= 7) { // There must be enough space for 3 cells
                    newShipComputer = [
                        `${horizontal}${vertical}`,
                        `${letters[horizontalIndex + 1]}${vertical}`,
                        `${letters[horizontalIndex + 2]}${vertical}`
                    ];
                };
            } else { // Vertical ship placement
                // Ensure the vertical ship doesn't go out of bounds (must fit 3 tiles)
                if (vertical <= 8) {
                    newShipComputer = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                };
            };

            // Check if the new ship overlaps or touches another ship
            if (newShipComputer.length === 3 && !hasOverlapOrTouch(newShipComputer)) {
                // If no overlap or touching, place the ship
                shipPosition[i] = newShipComputer;
                // Mark the cells as occupied
                newShipComputer.forEach(cell => occupiedCells.add(cell));
                placed = true; // Valid placement
                console.log("Ship placed at:", newShipComputer);
            };
        };
    };
};

export let playerShips = []; // Stores player ship positions
export let playerShipCount = 0; // Tracks how many ships have been placed
export let shipOrientation = "horizontal"; // Default orientation
let newShipPlayer = [];
let listenerAdded = false; // Ensure listeners don't get added multiple times on reset

/**
 * Function to let the user place ships
 */
export function userPlaceShips() {
    const playerBoard = document.getElementById("player-board");

    if (!listenerAdded) {
        // Toggle orientation when right-clicked
        playerBoard.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal"; // Toggle orientation
            console.log("Orientation switched to:", shipOrientation);
        });

        // Place ship on left-click (Limited to 3 ships)
        playerBoard.addEventListener("click", (e) => {
            if (!e.target.classList.contains("cell")) return; // Ensure a cell is clicked

            // Check if the player has already placed 3 ships
            if (playerShipCount >= 3) {
                console.log("You have already placed all 3 ships!");
                return; // Stop further placements if the player has placed 3 ships
            };

            // Get the cell ID
            let cellId = e.target.id.replace("player-board-", "");
            let [row, col] = cellId.split(/(\d+)/);
            col = parseInt(col);

            let letters = "abcdefghij";
            let rowIndex = letters.indexOf(row);

            // **Out-of-bounds check**
            if (shipOrientation === "horizontal") {
                if (col > 8) { // Prevent horizontal overflow (since ship is 3 cells long)
                    console.log("Invalid placement! Ship goes out of bounds horizontally.");
                    return;
                };
                newShipPlayer = [`${row}${col}`, `${row}${col + 1}`, `${row}${col + 2}`];
            } else { // Vertical placement
                if (rowIndex > 7) { // Prevent vertical overflow (since ship is 3 cells long)
                    console.log("Invalid placement! Ship goes out of bounds vertically.");
                    return;
                };
                newShipPlayer = [
                    `${letters[rowIndex]}${col}`,
                    `${letters[rowIndex + 1]}${col}`,
                    `${letters[rowIndex + 2]}${col}`
                ];
            };

            // Check if ship placement is valid (no overlap)
            if (!isValidPlacement(newShipPlayer)) {
                console.log("Invalid placement! Overlapping or out of bounds.");
                return;
            };

            // Place the ship (color the cells)
            newShipPlayer.forEach(cell => {
                let shipCell = document.getElementById(`player-board-${cell}`);
                if (shipCell) {
                    // To be changed to an image or something!
                    shipCell.style.backgroundColor = "blue";
                    placedCells.push(cell);
                };
            });

            playerShips.push(newShipPlayer); // Add new ship to player ships array

            playerShipCount++; // Increment the ship count after placing a ship
            console.log(`Ship ${playerShipCount}/3 placed at:`, newShipPlayer);
            console.log("Current player ships:", playerShips); // Debugging log

            if (playerShipCount >= 3) {
                updatePrompt("It's your turn! Click on a cell to attack.");
                // Create computer board once player has placed ships!
                // Until then, add a text saying "place your ships"
                createBoard("computer-board");
                // Add hover effect on computer board
                document.getElementById("computer-board").classList.add("computer-board-active");
                playerAttack();
            };
        });
        listenerAdded = true;
    };
};

export let guessedCells = new Set(); // Track already guessed cells
export let hitCounterComputer = 0; // Track cells hit by computer so the game can end
export let priorityTargets = []; // Stores cells to prioritize (adjacent to hits)
export let currentHitChain = []; // Tracks the current ship being hit
export let hitShipDirection = ""; // Will hold the direction (horizontal/vertical) of the hit ship

export function computerAttack() {
    setTimeout(() => {
        let targetCell;

        // If there are priority targets (adjacent cells from a previous hit), attack them first
        if (priorityTargets.length > 0) {
            targetCell = priorityTargets.shift(); // Get the next priority target
        } else {
            // Otherwise, pick a random cell that hasn't been guessed
            do {
                targetCell = getRandomCell("player-board");
            } while (guessedCells.has(targetCell));
        };

        // Mark the cell as guessed
        guessedCells.add(targetCell);

        if (isShipAtCell(targetCell, playerShips)) {
            console.log(`Computer hit your ship at ${targetCell}!`);
            document.getElementById(`${targetCell}`).style.backgroundImage = "url('/images/hit.png')";
            document.getElementById(`${targetCell}`).style.backgroundSize = "cover";
            document.getElementById(`${targetCell}`).style.backgroundPosition = "center";
            hitCounterComputer++;
            console.log(`Computer has hit ${hitCounterComputer} cells!`);

            // Add adjacent cells to priority list (if they haven't been guessed yet)
            addAdjacentCells(targetCell);

            // Track computer hits, when computer wins, call end game modal
            if (hitCounterComputer === 9) {
                let gameOverModal = new bootstrap.Modal(document.getElementById("game-over"));
                gameOverModal.show();
                // Get the game board containers by their IDs
                document.getElementById("show-result").innerText = "Congratulations, you won!";
                let playerBoard = document.getElementById('player-board');
                let computerBoard = document.getElementById('computer-board');

                // Add listener for modal close and reset
                document.getElementById("reset-button").addEventListener("click", (e) => {
                    // Clear the boards by removing all child elements
                    playerBoard.innerHTML = '';
                    computerBoard.innerHTML = '';
                    // These will be called when the player presses "Play again" in the game over modal
                    createBoard("player-board");

                    // Reset all variables to restart game
                    resetGame();
                    resetHitCounter();
                    resetCurrentTurn();

                    // Computer to place ships again
                    computerPlaceShips();

                    gameOverModal.hide();

                    // Start game again
                    highlightUserCells();
                    userPlaceShips();
                    updatePrompt("Place your ships on your board by left-clicking (right-clicking changes orientation).");

                });
                return; // prevent game from continuing
            };
        } else {
            console.log(`Computer missed at ${targetCell}.`);
            document.getElementById(`${targetCell}`).style.backgroundColor = "gray";
        };
    }, 2000);
};

/**
 * Add adjacent cells of a hit cell to priorityTargets
 */
function addAdjacentCells(cell) {
    let letters = "abcdefghij";

    // Remove "player-board-" prefix to get just "a1", "b3", etc.
    let cleanCell = cell.replace("player-board-", "");

    let row = cleanCell[0];
    let col = parseInt(cleanCell.slice(1));

    let rowIndex = letters.indexOf(row);
    let possibleCells = [];

    // Track hits in the current ship chain
    if (!currentHitChain.includes(cell)) {
        currentHitChain.push(cell);
    };

    // If 3 hits are recorded in a row, reset priority targets
    if (currentHitChain.length === 3) {
        console.log("Ship sunk!");
        priorityTargets.length = 0;
        currentHitChain = [];
        hitShipDirection = "";
        return;
    };

    // If two adjacent cells are hit, determine direction (horizontal or vertical)
    if (currentHitChain.length === 2) {
        let firstHit = currentHitChain[0].replace("player-board-", "");
        let secondHit = currentHitChain[1].replace("player-board-", "");

        if (firstHit[0] === secondHit[0]) {
            hitShipDirection = 'horizontal';
        } else if (firstHit[1] === secondHit[1]) {
            hitShipDirection = 'vertical';
        };
    };

    // If two hits are in the same row (horizontal), continue guessing in that row
    if (hitShipDirection === 'horizontal') {
        if (col > 1) possibleCells.push(`${row}${col - 1}`);
        if (col < 10) possibleCells.push(`${row}${col + 1}`);
    };

    // If two hits are in the same column (vertical), continue guessing in that column
    if (hitShipDirection === 'vertical') {
        if (rowIndex > 0) possibleCells.push(`${letters[rowIndex - 1]}${col}`);
        if (rowIndex < 9) possibleCells.push(`${letters[rowIndex + 1]}${col}`);
    };

    // Otherwise, check all four possible adjacent cells
    if (hitShipDirection === "") {
        if (rowIndex > 0) possibleCells.push(`${letters[rowIndex - 1]}${col}`);
        if (rowIndex < 9) possibleCells.push(`${letters[rowIndex + 1]}${col}`);
        if (col > 1) possibleCells.push(`${row}${col - 1}`);
        if (col < 10) possibleCells.push(`${row}${col + 1}`);
    };

    // Add only unguessed cells to the priority target list with correct ID format
    possibleCells.forEach(adjCell => {
        let formattedCell = `player-board-${adjCell}`; // Re-add the prefix!
        if (!guessedCells.has(formattedCell) && !priorityTargets.includes(formattedCell)) {
            priorityTargets.push(formattedCell);
        };
    });
};

/**
 * Function to reset game when one player wins
 */
export function resetGame() {
    hitCounterComputer = 0;
    guessedCells = new Set();
    priorityTargets = [];
    currentHitChain = [];
    hitShipDirection = "";
    playerShipCount = 0;
    shipPosition = [];
    playerShips.length = 0;
    newShipPlayer.length = 0;
    newShipComputer.length = 0;
};