import {
    placedCells
} from "./events.js";

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