let shipCellsToHighlight = []; // Store highlighted cells
let placedCells = []; // Store placed ship cells

// Create the game board
export function createBoard(boardId) {
    const board = document.getElementById(boardId);
    const letters = "abcdefghij";

    for (let row = 0; row < 10; row++) {
        for (let col = 1; col <= 10; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `${boardId}-${letters[row]}${col}`;
            board.appendChild(cell);
        }
    }
}

// Function to color ship cells (for revealing ships)
export function colorShipCells(boardId) {
    shipPosition.forEach(ship => {
        ship.forEach(cellId => {
            const cell = document.getElementById(`${boardId}-${cellId}`);
            if (cell) cell.style.backgroundColor = "red";
        });
    });
}

// Function to update hover highlights for ship placement
export function updateHighlightedCells(shipOrientation) {
    document.getElementById("player-board").addEventListener("mousemove", (e) => {
        if (!e.target.classList.contains("cell")) return;

        let cellId = e.target.id.replace("player-board-", "");
        let [row, col] = cellId.split(/(\d+)/);
        col = parseInt(col);

        shipCellsToHighlight.forEach(cell => {
            if (!placedCells.includes(cell)) {
                let highlightedCell = document.getElementById(`player-board-${cell}`);
                if (highlightedCell) highlightedCell.style.backgroundColor = "";
            }
        });

        shipCellsToHighlight = [];

        if (shipOrientation === "horizontal") {
            for (let i = 0; i < 3; i++) {
                let newCell = `${row}${col + i}`;
                shipCellsToHighlight.push(newCell);
                let cellToHighlight = document.getElementById(`player-board-${newCell}`);
                if (cellToHighlight) cellToHighlight.style.backgroundColor = "lightgray";
            }
        } else {
            let letters = "abcdefghij";
            let rowIndex = letters.indexOf(row);
            for (let i = 0; i < 3; i++) {
                let newRow = letters[rowIndex + i];
                let newCell = `${newRow}${col}`;
                shipCellsToHighlight.push(newCell);
                let cellToHighlight = document.getElementById(`player-board-${newCell}`);
                if (cellToHighlight) cellToHighlight.style.backgroundColor = "lightgray";
            }
        }
    });
}