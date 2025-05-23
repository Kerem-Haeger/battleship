import {
    isValidPlacement,
    hasOverlapOrTouch,
    isShipAtCell,
    getRandomCell,
    updatePrompt,
    flashOrientationHint
} from './utils.js';

import {
    placedCells,
    playerAttack,
    playerScore
} from './events.js';

import {
    createBoard,
    createBoardLabels
} from './ui.js';

export let shipPosition = []; // This will store the Computer's ship starting points
export let occupiedCells = new Set(); // To store all occupied cells (for checking overlap and proximity)
export let newShipComputer = [];

/**
 * Computer to place ships at random
 * 
 * Ships can only be placed if they fully fit on the board (placed is false by default)
 */
export function computerPlaceShips() {
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
                }
            } else { // Vertical ship placement
                // Ensure the vertical ship doesn't go out of bounds (must fit 3 tiles)
                if (vertical <= 8) {
                    newShipComputer = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                }
            }

            // Check if the new ship overlaps or touches another ship
            // Array.isArray ensures no error thrown on page load
            if (Array.isArray(newShipComputer) && newShipComputer.length === 3 && !hasOverlapOrTouch(newShipComputer)) {
                // If no overlap or touching, place the ship
                shipPosition[i] = [...newShipComputer];
                // Mark the cells as occupied
                newShipComputer.forEach(cell => occupiedCells.add(cell));
                placed = true; // Valid placement

                // Log newShipComputer here for debugging! (Will reveal ships placed by computer)

            }
        }
    }
}

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
    playerBoard.focus();

    if (!listenerAdded) {
        // Toggle orientation when right-clicked
        playerBoard.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal"; // Toggle orientation
        });

        let longPressTimer;
        let longPressTriggered = false;

        // Mobile: long press toggles orientation
        playerBoard.addEventListener("touchstart", (e) => {
            longPressTriggered = false;

            longPressTimer = setTimeout(() => {
                e.preventDefault();
                longPressTriggered = true;
                shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal";
                flashOrientationHint(shipOrientation);
                updatePrompt(`Orientation switched to: ${shipOrientation}`);
            }, 600);
        }, {
            passive: false
        });

        // Cancel long press if finger moves
        playerBoard.addEventListener("touchmove", (e) => {
            e.preventDefault();
            clearTimeout(longPressTimer);
        }, {
            passive: false
        });

        // Handle touchend
        playerBoard.addEventListener("touchend", (e) => {
            clearTimeout(longPressTimer);

            if (longPressTriggered) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }

        }, {
            passive: false
        });

        // Place ship on left-click (Limited to 3 ships)
        playerBoard.addEventListener("click", (e) => {
            if (!e.target.classList.contains("cell")) return; // Ensure a cell is clicked

            // Check if the player has already placed 3 ships
            if (playerShipCount >= 3) {
                return; // Stop further placements if the player has placed 3 ships
            }

            // Get the cell ID
            let cellId = e.target.id.replace("player-board-", "");
            let [row, col] = cellId.split(/(\d+)/);
            col = parseInt(col);

            let letters = "abcdefghij";
            let rowIndex = letters.indexOf(row);

            // **Out-of-bounds check**
            if (shipOrientation === "horizontal") {
                if (col > 8) { // Prevent horizontal overflow (since ship is 3 cells long)
                    return;
                }
                newShipPlayer = [`${row}${col}`, `${row}${col + 1}`, `${row}${col + 2}`];
            } else { // Vertical placement
                if (rowIndex > 7) { // Prevent vertical overflow (since ship is 3 cells long)
                    return;
                }
                newShipPlayer = [
                    `${letters[rowIndex]}${col}`,
                    `${letters[rowIndex + 1]}${col}`,
                    `${letters[rowIndex + 2]}${col}`
                ];
            }

            // Check if ship placement is valid (no overlap)
            if (!isValidPlacement(newShipPlayer)) {
                return;
            }

            // Place the ship (color the cells)
            newShipPlayer.forEach((cell, index) => {
                let shipCell = document.getElementById(`player-board-${cell}`);
                if (shipCell) {
                    shipCell.classList.add("ship-segment");

                    if (shipOrientation === "horizontal") {
                        if (index === 0) shipCell.classList.add("ship-horizontal-back");
                        else if (index === 1) shipCell.classList.add("ship-horizontal-middle");
                        else shipCell.classList.add("ship-horizontal-front");
                    } else {
                        if (index === 0) shipCell.classList.add("ship-vertical-back");
                        else if (index === 1) shipCell.classList.add("ship-vertical-middle");
                        else shipCell.classList.add("ship-vertical-front");
                    }

                    placedCells.push(cell);
                }
            });



            playerShips.push(newShipPlayer); // Add new ship to player ships array

            playerShipCount++; // Increment the ship count after placing a ship

            if (playerShipCount >= 3) {
                updatePrompt("It's your turn! Click on a cell on the computer board to attack.");
                // Create computer board once player has placed ships!
                createBoard("computer-board");
                createBoardLabels(document.querySelector("#computer-board").parentElement);
                document.getElementById("computer-wrapper").style.visibility = "visible";
                // Add hover effect on computer board
                document.getElementById("computer-board").classList.add("computer-board-active");
                playerAttack();
            }
        });
        listenerAdded = true;
    }
}

export let guessedCells = new Set(); // Track already guessed cells
export let hitCounterComputer = 0; // Track cells hit by computer so the game can end
export let priorityTargets = []; // Stores cells to prioritize (adjacent to hits)
export let currentHitChain = []; // Tracks the current ship being hit
export let hitShipDirection = ""; // Will hold the direction (horizontal/vertical) of the hit ship
export let computerScore = 0; // Track score on for replay

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
            // Remove ship graphic before applying hit graphic
            document.getElementById(`${targetCell}`).classList.remove(
                "ship-segment",
                "ship-horizontal-front",
                "ship-horizontal-middle",
                "ship-horizontal-back",
                "ship-vertical-front",
                "ship-vertical-middle",
                "ship-vertical-back"
            );
            document.getElementById(`${targetCell}`).style.backgroundColor = 'rgb(102, 187, 216)';
            document.getElementById(`${targetCell}`).classList.add("hit-cell");
            hitCounterComputer++;

            // Add adjacent cells to priority list (if they haven't been guessed yet)
            addAdjacentCells(targetCell);

            // Track computer hits, when computer wins, call end game modal
            if (hitCounterComputer === 9) {
                let gameOverModal = new bootstrap.Modal(document.getElementById("game-over"));
                document.getElementById("show-result").innerText = "Game over - the computer won!";

                computerScore++;
                document.getElementById("score").innerHTML = `Player: ${playerScore} <span class="space-between"></span> Computer: ${computerScore}`;

                gameOverModal.show();
                return; // prevent further actions in this function
            }
        } else {
            document.getElementById(`${targetCell}`).style.backgroundColor = "rgb(102, 187, 216)";
            document.getElementById(`${targetCell}`).classList.add("missed-cell");
        }
    }, 2000);
}

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
    }

    // If 3 hits are recorded in a row, reset priority targets
    if (currentHitChain.length === 3) {
        priorityTargets.length = 0;
        currentHitChain = [];
        hitShipDirection = "";
        return;
    }

    // If two adjacent cells are hit, determine direction (horizontal or vertical)
    if (currentHitChain.length === 2) {
        let firstHit = currentHitChain[0].replace("player-board-", "");
        let secondHit = currentHitChain[1].replace("player-board-", "");

        if (firstHit[0] === secondHit[0]) {
            hitShipDirection = 'horizontal';
        } else if (firstHit[1] === secondHit[1]) {
            hitShipDirection = 'vertical';
        }
    }

    // If two hits are in the same row (horizontal), continue guessing in that row
    if (hitShipDirection === 'horizontal') {
        if (col > 1) possibleCells.push(`${row}${col - 1}`);
        if (col < 10) possibleCells.push(`${row}${col + 1}`);
    }

    // If two hits are in the same column (vertical), continue guessing in that column
    if (hitShipDirection === 'vertical') {
        if (rowIndex > 0) possibleCells.push(`${letters[rowIndex - 1]}${col}`);
        if (rowIndex < 9) possibleCells.push(`${letters[rowIndex + 1]}${col}`);
    }

    // Otherwise, check all four possible adjacent cells
    if (hitShipDirection === "") {
        if (rowIndex > 0) possibleCells.push(`${letters[rowIndex - 1]}${col}`);
        if (rowIndex < 9) possibleCells.push(`${letters[rowIndex + 1]}${col}`);
        if (col > 1) possibleCells.push(`${row}${col - 1}`);
        if (col < 10) possibleCells.push(`${row}${col + 1}`);
    }

    // Add only unguessed cells to the priority target list with correct ID format
    possibleCells.forEach(adjCell => {
        let formattedCell = `player-board-${adjCell}`; // Re-add the prefix!
        if (!guessedCells.has(formattedCell) && !priorityTargets.includes(formattedCell)) {
            priorityTargets.push(formattedCell);
        }
    });
}

/**
 * Function to reset game when one player wins
 */
export function resetGame() {
    hitCounterComputer = 0;
    guessedCells.clear();
    occupiedCells.clear();
    priorityTargets.length = 0;
    currentHitChain.length = 0;
    hitShipDirection = "";
    playerShipCount = 0;
    shipPosition.length = 0;
    playerShips.length = 0;
    newShipPlayer.length = 0;
    newShipComputer.length = 0;
}