document.addEventListener("DOMContentLoaded", function () {
    var myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    myModal.show(); // Opens the modal on page load
});

const createBoard = (boardId) => {
    const board = document.getElementById(boardId);
    const letters = "abcdefghij";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); // Add the class cell so can be styled by CSS
            cell.id = `${letters[row]}${col}`; // e.g., a1, b2
            // cell.addEventListener("click", (e) => handleCellClick(e.target));
            board.appendChild(cell);
        }
    }
};

document.querySelector(".btn-secondary").addEventListener("click", function () {
    let playerName = document.getElementById("player-name").value;
    if (playerName === "") {
        alert("Please enter your name");
    } else {
        console.log(playerName);
        let modal = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop"));
        modal.hide(); // Manually close the modal
        document.getElementById("enteredName").innerText = playerName;
    }
});

createBoard("player-board");
createBoard("computer-board");