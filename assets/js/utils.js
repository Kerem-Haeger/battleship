import {
    placedCells,
    playerAttackListener
} from './events.js';

import {
    occupiedCells,
    computerAttack
} from './game.js';

/**
 * Function to check if the new ship overlaps or touches another ship
 */
export function hasOverlapOrTouch(newShip) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of newShip) {
        if (occupiedCells.has(cell)) {
            return true; // Overlap detected
        }
    }

    // Check if any of the surrounding cells (buffer zone) are occupied (to avoid ships touching each other)
    for (let cell of newShip) {
        let [letter, number] = cell.split("");
        let letterIndex = "abcdefghij".indexOf(letter);
        let numberIndex = parseInt(number);

        // Check all adjacent cells around the ship (buffer zone)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip the ship's own cells
                let newLetter = "abcdefghij" [letterIndex + dx];
                let newNumber = numberIndex + dy;

                // Check if the new position is within bounds and add it to the buffer zone
                if (newLetter && newNumber >= 1 && newNumber <= 10) {
                    let bufferCell = `${newLetter}${newNumber}`;
                    if (occupiedCells.has(bufferCell)) {
                        return true; // Touching detected
                    }
                }
            }
        }
    }

    return false; // No overlap or touching
}

/**
 * Function to check if the placement is valid (no overlap)
 */
export function isValidPlacement(ship) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of ship) {
        if (placedCells.includes(cell)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if a given cell contains a ship.
 */
export function isShipAtCell(cellId, shipArray) {
    let cell = cellId.replace('player-board-', ''); // Remove board specific prefix to match values...
    return shipArray.some(ship => ship.includes(cell)); // Returns true if the cell exists in any ship
}

/**
 * Generates a random cell ID for the game board.
 */
export function getRandomCell(boardId) {
    const letters = "abcdefghij";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;

    return `${boardId}-${randomLetter}${randomNumber}`;
}

export let canPlayerAttack = true; // Control player attack ability
export let currentTurn = "player";
/**
 * Switch the turn to the computer's turn and disable player attack
 */
export function switchTurn() {
    if (currentTurn === "player") {
        // Player's turn ends, switch to computer
        currentTurn = "computer";
        updatePrompt("Computer is attacking...");
        disablePlayerAttack();

        computerAttack();

        // After the computer attacks, switch turn back to player
        setTimeout(() => {
            currentTurn = "player";
            enablePlayerAttack();
            updatePrompt("It's your turn! Click on a cell on the computer board to attack.");
        }, 2010); // Delay to simulate the computer’s thinking process
    }
}


/**
 * Disable player attack
 */
export function disablePlayerAttack() {
    canPlayerAttack = false;
    document.getElementById("computer-board").removeEventListener("click", playerAttackListener);
}

/**
 * Enable player attack
 */
export function enablePlayerAttack() {
    canPlayerAttack = true;
    document.getElementById("computer-board").addEventListener("click", playerAttackListener);
}

/**
 * Update prompt displayed to user
 */
export function updatePrompt(message) {
    document.getElementById("prompt-text").textContent = message;
}

/**
 * Reset currentTurn and placedCells as it was declared here
 */
export function resetCurrentTurn() {
    currentTurn = "player";
    placedCells.length = 0;
}

/**
 * Flash a hint that orientation has changed on mobile
 */
export function flashOrientationHint(orientation) {
    const hint = document.getElementById("orientation-hint");
    if (!hint) return;

    hint.textContent = orientation === "horizontal" ? "↔ Horizontal" : "↕ Vertical";
    hint.classList.add("visible");

    if (navigator.vibrate) {
        navigator.vibrate(100);
    }

    setTimeout(() => {
        hint.classList.remove("visible");
    }, 2000);
}