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
            const clickedBoard = e.target.closest(".board").id; // Make distinction between the two boards
            console.log("Cell clicked:", e.target.id, "Board:", clickedBoard);
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

/**
 * Computer to place ships at random
 * 
 * Ships can only be placed if they fully fit on the board (placed is false by default)
 */
function computerPlaceShips() {
    for (let i = 0; i <= 2; i++) {
        let shipDirection = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

        let placed = false; // Flag to track whether the ship was successfully placed

        // Try until a valid position is found
        while (!placed) {
            if (shipDirection === 0) { // Horizontal ship placement
                let horizontal = letters[Math.floor(Math.random() * 10)];
                let vertical = Math.floor(Math.random() * 10) + 1;

                // Ensure the horizontal ship doesn't go out of bounds (must fit 3 tiles)
                let horizontalIndex = letters.indexOf(horizontal);

                // Check if the ship can fit 3 tiles horizontally (if at "i", it can't extend to 3 tiles)
                if (horizontalIndex <= 7) { // There must be enough space for 3 cells
                    shipPosition[i] = [
                        `${horizontal}${vertical}`,
                        `${letters[horizontalIndex + 1]}${vertical}`,
                        `${letters[horizontalIndex + 2]}${vertical}`
                    ];
                    placed = true; // Valid placement
                    console.log("Horizontal ship placed:", shipPosition[i]);
                }
            } else { // Vertical ship placement
                let horizontal = letters[Math.floor(Math.random() * 10)];
                let vertical = Math.floor(Math.random() * 10) + 1;

                // Ensure the vertical ship doesn't go out of bounds (must fit 3 tiles)
                if (vertical <= 8) { // There must be enough space for 3 cells
                    shipPosition[i] = [
                        `${horizontal}${vertical}`,
                        `${horizontal}${vertical + 1}`,
                        `${horizontal}${vertical + 2}`
                    ];
                    placed = true; // Valid placement
                    console.log("Vertical ship placed:", shipPosition[i]);
                }
            }
        }
    }
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
            const cell = document.getElementById(`${boardId}-${cellId}`); // e.g., "player-a1", "computer-board-a1"

            // Only color the cell if it's part of the specified board
            if (cell && board.contains(cell)) {
                cell.style.backgroundColor = "red";
            }
        });
    });
};

console.log(shipPosition);