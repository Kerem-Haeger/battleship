const createBoard = (boardId) => {
    const board = document.getElementById(boardId);
    const letters = "abcdefghij";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell"); // Add the class cell so can be styled by CSS
            cell.id = `${letters[row]}${col}`; // e.g., a1, b2
            cell.addEventListener("click", (e) => handleCellClick(e.target));
            board.appendChild(cell);
        }
    }
};

createBoard("player-board");
createBoard("computer-board");