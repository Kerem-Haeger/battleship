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
            cell.id = `${letters[row]}${col}`; // e.g., a1, b2
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
    }
}

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

let shipPosition1 = "";
/**
 * Computer to place ships at random
 * For now this is just a template to see if it works
 * 
 * to add: length of the ship, so it doesn't leave the board
 * to add: store the position of the ship to access outside of function
 */
function computerPlaceShips() {
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    let horizontal = letters[Math.floor(Math.random() * 10)];
    let vertical = Math.floor(Math.random() * 10 + 1);
    shipPosition1 = `${horizontal}${vertical}`;
    console.log(shipPosition1);
}

computerPlaceShips();
console.log("Ship 1 placed at:", shipPosition1);