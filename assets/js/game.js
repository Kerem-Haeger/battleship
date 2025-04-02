import {
    isValidPlacement,
    hasOverlapOrTouch,
    isShipAtCell,
    getRandomCell
} from './utils.js'

import {
    placedCells,
    playerAttack
} from './events.js';

export let shipPosition = []; // This will store the Computer's ship starting points
export let occupiedCells = new Set(); // To store all occupied cells (for checking overlap and proximity)

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
            let newShip = [];

            if (shipDirection === 0) { // Horizontal ship placement
                let horizontalIndex = letters.indexOf(horizontal);

                // Ensure the horizontal ship doesn't go out of bounds (must fit 3 tiles)
                if (horizontalIndex <= 7) { // There must be enough space for 3 cells
                    newShip = [
                        `${horizontal}${vertical}`,
                        `${letters[horizontalIndex + 1]}${vertical}`,
                        `${letters[horizontalIndex + 2]}${vertical}`
                    ];
                };
            } else { // Vertical ship placement
                // Ensure the vertical ship doesn't go out of bounds (must fit 3 tiles)
                if (vertical <= 8) {
                    newShip = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                };
            };

            // Check if the new ship overlaps or touches another ship
            if (newShip.length === 3 && !hasOverlapOrTouch(newShip)) {
                // If no overlap or touching, place the ship
                shipPosition[i] = newShip;
                // Mark the cells as occupied
                newShip.forEach(cell => occupiedCells.add(cell));
                placed = true; // Valid placement
                console.log("Ship placed at:", newShip);
            };
        };
    };
};

export let playerShips = []; // Stores player ship positions
export let playerShipCount = 0; // Tracks how many ships have been placed
export let shipOrientation = "horizontal"; // Default orientation

/**
 * Function to let the user place ships
 */
export function userPlaceShips() {

    // Toggle orientation when right-clicked
    document.getElementById("player-board").addEventListener("contextmenu", (e) => {
        e.preventDefault();
        shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal"; // Toggle orientation
        console.log("Orientation switched to:", shipOrientation);
    });

    // Place ship on left-click (Limited to 3 ships)
    document.getElementById("player-board").addEventListener("click", (e) => {
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

        let newShip = [];
        let letters = "abcdefghij";
        let rowIndex = letters.indexOf(row);

        // **Out-of-bounds check**
        if (shipOrientation === "horizontal") {
            if (col > 8) { // Prevent horizontal overflow (since ship is 3 cells long)
                console.log("Invalid placement! Ship goes out of bounds horizontally.");
                return;
            };
            newShip = [`${row}${col}`, `${row}${col + 1}`, `${row}${col + 2}`];
        } else { // Vertical placement
            if (rowIndex > 7) { // Prevent vertical overflow (since ship is 3 cells long)
                console.log("Invalid placement! Ship goes out of bounds vertically.");
                return;
            };
            newShip = [
                `${letters[rowIndex]}${col}`,
                `${letters[rowIndex + 1]}${col}`,
                `${letters[rowIndex + 2]}${col}`
            ];
        };

        // Check if ship placement is valid (no overlap)
        if (!isValidPlacement(newShip)) {
            console.log("Invalid placement! Overlapping or out of bounds.");
            return;
        };

        // Place the ship (color the cells)
        newShip.forEach(cell => {
            let shipCell = document.getElementById(`player-board-${cell}`);
            if (shipCell) {
                // To be changed to an image or something!
                shipCell.style.backgroundColor = "blue";
                placedCells.push(cell);
            };
        });

        playerShips.push(newShip); // Add new ship to player ships array

        playerShipCount++; // Increment the ship count after placing a ship
        console.log(`Ship ${playerShipCount}/3 placed at:`, newShip);
        console.log("Current player ships:", playerShips); // Debugging log

        if (playerShipCount >= 3) {
            // Add hover effect on computer board
            document.getElementById("computer-board").classList.add("computer-board-active");
            playerAttack();
        };
    });
};

let guessedCells = new Set(); // Track already guessed cells
let hitCounterComputer = 0; // Track cells hit by computer so the game can end
let priorityTargets = []; // Stores cells to prioritize (adjacent to hits)

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
        }

        // Mark the cell as guessed
        guessedCells.add(targetCell);

        if (isShipAtCell(targetCell, playerShips)) {
            console.log(`Computer hit your ship at ${targetCell}!`);
            document.getElementById(`${targetCell}`).style.backgroundColor = "red";
            hitCounterComputer++;
            console.log(`Computer has hit ${hitCounterComputer} cells!`);

            // Add adjacent cells to priority list (if they haven't been guessed yet)
            addAdjacentCells(targetCell);

            // Track computer hits, alert for now, call function later
            if (hitCounterComputer === 9) {
                alert("Computer wins!");
            }
        } else {
            console.log(`Computer missed at ${targetCell}.`);
            document.getElementById(`${targetCell}`).style.backgroundColor = "gray";
        }
    }, 1000);
};

/**
 * Add adjacent cells of a hit cell to priorityTargets
 */
function addAdjacentCells(cell) {
    let letters = "abcdefghij"; // Board row labels

    // Remove "player-board-" prefix to get just "a1", "b3", etc.
    let cleanCell = cell.replace("player-board-", "");

    let row = cleanCell[0]; // Letter part of the coordinate
    let col = parseInt(cleanCell.slice(1)); // Number part of the coordinate

    let rowIndex = letters.indexOf(row);
    let possibleCells = [];

    // Check all four possible adjacent cells
    if (rowIndex > 0) possibleCells.push(`${letters[rowIndex - 1]}${col}`); // Up
    if (rowIndex < 9) possibleCells.push(`${letters[rowIndex + 1]}${col}`); // Down
    if (col > 1) possibleCells.push(`${row}${col - 1}`); // Left
    if (col < 10) possibleCells.push(`${row}${col + 1}`); // Right

    // Add only unguessed cells to the priority target list with correct ID format
    possibleCells.forEach(adjCell => {
        let formattedCell = `player-board-${adjCell}`; // Re-add the prefix
        if (!guessedCells.has(formattedCell)) {
            priorityTargets.push(formattedCell);
        };
    });
};