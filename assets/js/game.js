import {
    colorShipCells
} from './ui.js';
import {
    hasOverlapOrTouch
} from './utils.js';

let shipPosition = []; // Stores computer's ships
let occupiedCells = new Set(); // Tracks occupied cells to prevent overlap

// Function to start the game
export function startGame() {
    console.log("Game started!");
}

// Function for the computer to place ships
export function computerPlaceShips() {
    let letters = "abcdefghij";

    for (let i = 0; i <= 2; i++) {
        let placed = false;

        while (!placed) {
            let shipDirection = Math.floor(Math.random() * 2); // 0 = horizontal, 1 = vertical
            let horizontal = letters[Math.floor(Math.random() * 10)];
            let vertical = Math.floor(Math.random() * 10) + 1;
            let newShip = [];

            if (shipDirection === 0) { // Horizontal placement
                let horizontalIndex = letters.indexOf(horizontal);
                if (horizontalIndex <= 7) {
                    newShip = [
                        `${horizontal}${vertical}`,
                        `${letters[horizontalIndex + 1]}${vertical}`,
                        `${letters[horizontalIndex + 2]}${vertical}`
                    ];
                }
            } else { // Vertical placement
                if (vertical <= 8) {
                    newShip = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                }
            }

            // Check if placement is valid
            if (newShip.length === 3 && !hasOverlapOrTouch(newShip)) {
                shipPosition[i] = newShip;
                newShip.forEach(cell => occupiedCells.add(cell));
                placed = true;
                console.log("Ship placed at:", newShip);
            }
        }
    }
}