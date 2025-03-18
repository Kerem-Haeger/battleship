/**
 * On loading the user is presented with an obligatory modal to enter their name
 */
document.addEventListener("DOMContentLoaded", function () {
    var nameModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    nameModal.show();
});

const cells = []; // Array to store references to the cells

const createBoard = (boardId) => {
    const board = document.getElementById(boardId);
    const letters = "abcdefghij";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); // Add the class cell so it can be styled by CSS

            // Add a board-specific prefix to the cell ID (e.g., "player-" or "pc-")
            cell.id = `${boardId}-${letters[row]}${col}`; // e.g., player-a1, pc-a1
            board.appendChild(cell);
            // Store the cell in the array
            cells.push(cell);
        }
    }
};

// Add event listeners
const addCellEventListeners = () => {
    cells.forEach(cell => {
        cell.addEventListener("click", function (e) {
            console.log("Cell clicked:", e.target.id);
            // Use this later to handle miss/hit events etc!
        });
    });
};


/**
 * Closes the modal and sets the player name to what was entered
 */
function handleConfirm() {
    let playerName = document.getElementById("player-name").value.trim(); // Trim removes extra spaces

    if (playerName === "") {
        alert("Please enter your name"); // Avoid user not entering a name
    } else {
        let modal = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop"));
        modal.hide(); // Manually close the modal
        document.getElementById("enteredName").innerText = playerName;
        computerPlaceShips(); // Once modal is closed, computer places ships
        colorShipCells("computer-board"); // Color the cells only in the computer board
    };
};

// Modal can be closed by button click or Enter key
document.querySelector(".btn-secondary").addEventListener("click", handleConfirm);

document.getElementById("player-name").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        handleConfirm();
    };
});

createBoard("player-board");
createBoard("computer-board");

addCellEventListeners();

let shipPosition = []; // This will store the Computer's ship starting points

let occupiedCells = new Set(); // To store all occupied cells (for checking overlap and proximity)

/**
 * Computer to place ships at random
 * 
 * Ships can only be placed if they fully fit on the board (placed is false by default)
 */
function computerPlaceShips() { // To add later: difficulty can be changed with more or less ships
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

/**
 * Function to check if the new ship overlaps or touches another ship
 */
function hasOverlapOrTouch(newShip) {
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
 * Function to color ship cells
 * 
 * this is temporary but might be called when the game is over to reveal the board
 */
function colorShipCells(boardId) {
    const board = document.getElementById(boardId);

    // Loop over the shipPosition array, which contains the ships' coordinates
    shipPosition.forEach(ship => {
        ship.forEach(cellId => {
            // Update the cell ID to include the boardId prefix
            const cell = document.getElementById(`${boardId}-${cellId}`);

            // Only color the cell if it's part of the specified board
            if (cell && board.contains(cell)) {
                cell.style.backgroundColor = "red";
            };
        });
    });
};

// Highlighting cells on hover before placing ships

let shipCellsToHighlight = []; // Store the cells to be highlighted
let computerShips = []; // Store the cells that have ships placed

document.getElementById("player-board").addEventListener("mousemove", (e) => {
    if (!e.target.classList.contains("cell")) return; // Ensure a cell is hovered

    // Get the cell ID (e.g., a1)
    let cellId = e.target.id.replace("player-board-", "");
    let [row, col] = cellId.split(/(\d+)/);
    col = parseInt(col);

    // Clear previously highlighted cells (excluding placed ships)
    shipCellsToHighlight.forEach(cell => {
        if (!computerShips.includes(cell)) { // Don't clear cells where ships are placed
            let highlightedCell = document.getElementById(`player-board-${cell}`);
            if (highlightedCell) {
                highlightedCell.style.backgroundColor = ""; // Reset the color
            }
        }
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
            if (cellToHighlight && !computerShips.includes(newCell)) {
                cellToHighlight.style.backgroundColor = "lightgray"; // Highlight potential cells
            }
        }
    } else if (shipOrientation === "vertical") {
        // Highlight 3 vertical cells (even beyond the board)
        let letters = "abcdefghij";
        let rowIndex = letters.indexOf(row);
        for (let i = 0; i < 3; i++) {
            let newRow = letters[rowIndex + i];
            let newCell = `${newRow}${col}`;
            shipCellsToHighlight.push(newCell);
            let cellToHighlight = document.getElementById(`player-board-${newCell}`);
            if (cellToHighlight && !computerShips.includes(newCell)) {
                cellToHighlight.style.backgroundColor = "lightgray"; // Highlight potential cells
            }
        }
    }
});

// Reset all cells when mouse leaves the board
document.getElementById("player-board").addEventListener("mouseleave", () => {
    // Only reset non-placed cells
    shipCellsToHighlight.forEach(cell => {
        if (!computerShips.includes(cell)) { // Don't clear placed ship cells
            let highlightedCell = document.getElementById(`player-board-${cell}`);
            if (highlightedCell) {
                highlightedCell.style.backgroundColor = ""; // Reset color
            }
        }
    });
});

// User placing ships below!

let playerShips = []; // Stores player ship positions
let playerShipCount = 0; // Tracks how many ships have been placed
let shipOrientation = "horizontal"; // Default orientation

// Prevent right-click menu on the board
document.getElementById("player-board").addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

/**
 * Function to toggle orientation when right-clicked
 */
document.getElementById("player-board").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    shipOrientation = shipOrientation === "horizontal" ? "vertical" : "horizontal"; // Toggle orientation
    console.log("Orientation switched to:", shipOrientation);
});

/**
 * Function to place ship on left-click (Limited to 3 ships)
 */
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

    // Horizontal placement
    if (shipOrientation === "horizontal") {
        newShip = [`${row}${col}`, `${row}${col + 1}`, `${row}${col + 2}`];
    } else { // Vertical placement
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
            shipCell.style.backgroundColor = "blue";
            placedCells.push(cell);
        };
    });

    playerShipCount++; // Increment the ship count after placing a ship
    console.log(`Ship ${playerShipCount}/3 placed at:`, newShip);

    if (playerShipCount >= 3) {
        document.querySelector(".start-game").removeAttribute("disabled"); // Enable the button
        // Use removeAttribute to ensure it stays enabled
    };
});

/**
 * Function to check if the placement is valid (no overlap)
 */
function isValidPlacement(ship) {
    // Check if any of the cells in the new ship are already occupied
    for (let cell of ship) {
        if (placedCells.includes(cell)) {
            return false;
        };
    };
    return true;
};