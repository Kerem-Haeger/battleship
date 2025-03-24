// Function to check if a ship overlaps or touches another ship
export function hasOverlapOrTouch(newShip) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of newShip) {
        if (occupiedCells.has(cell)) {
            return true; // Overlap detected
        }
    }

    // Check if any of the surrounding cells (buffer zone) are occupied (to avoid ships touching each other)
    for (let cell of newShip) {
        let [letter, number] = cell.split(""); // Split the cell ID into letter and number
        let letterIndex = "abcdefghij".indexOf(letter); // Get the index of the letter (row)
        let numberIndex = parseInt(number); // Convert the number to an integer

        // Check all adjacent cells around the ship (buffer zone)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip the ship's own cells
                let newLetter = "abcdefghij" [letterIndex + dx]; // Calculate new row
                let newNumber = numberIndex + dy; // Calculate new column

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

// Function to generate a random number between 0 and max (used for random ship placement)
export function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}