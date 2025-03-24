import {
    placedCells
} from './events.js';

import {
    occupiedCells
} from './game.js'

/**
 * Function to check if the new ship overlaps or touches another ship
 */
export function hasOverlapOrTouch(newShip) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of newShip) {
        if (occupiedCells.has(cell)) {
            return true; // Overlap detected
        };
    };

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
                    };
                };
            };
        };
    };

    return false; // No overlap or touching
};

/**
 * Function to check if the placement is valid (no overlap)
 */
export function isValidPlacement(ship) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of ship) {
        if (placedCells.includes(cell)) {
            return false;
        };
    };
    return true;
};