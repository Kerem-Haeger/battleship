const createBoard = (boardId) => {
    const board = document.getElementById(boardId);
    const letters = "ABCDEFGHIJ";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `${letters[row]}${col}`; // e.g., A1, B2
            cell.addEventListener("click", (e) => handleCellClick(e.target));
            board.appendChild(cell);
        }
    }
};

const handleCellClick = (cell) => {
    console.log("Cell clicked:", cell.id);
    cell.style.backgroundColor = "red"; // Example of changing tile color
};

createBoard("player-board");
createBoard("computer-board");