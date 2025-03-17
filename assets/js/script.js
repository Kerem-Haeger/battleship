/**
 * On loading the user is presented with an obligatory modal to enter their name
 */
document.addEventListener("DOMContentLoaded", function () {
    var myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    myModal.show();
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
            // Not sure if the closest board is still needed

            if (e.target.id.includes("player-board")) {
                let cell = document.getElementById(e.target.id);
                cell.style.backgroundColor = "red";
            }
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
        colorShipCells("computer-board"); // Color the cells only in the computer board (pc- prefix)
    }
};

// Modal can be closed by button click or Enter key
document.querySelector(".btn-secondary").addEventListener("click", handleConfirm);

document.getElementById("player-name").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        handleConfirm();
    }
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
                }
            } else { // Vertical ship placement
                // Ensure the vertical ship doesn't go out of bounds (must fit 3 tiles)
                if (vertical <= 8) {
                    newShip = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                }
            }

            // Check if the new ship overlaps or touches another ship
            if (newShip.length === 3 && !hasOverlapOrTouch(newShip)) {
                // If no overlap or touching, place the ship
                shipPosition[i] = newShip;
                // Mark the cells as occupied
                newShip.forEach(cell => occupiedCells.add(cell));
                placed = true; // Valid placement
                console.log("Ship placed at:", newShip);
            }
        }
    }
};

/**
 * Function to check if the new ship overlaps or touches another ship
 */
function hasOverlapOrTouch(newShip) {
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
            }
        });
    });
};

function userPlaceShips() {

}