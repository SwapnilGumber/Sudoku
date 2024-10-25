var numSelected = null;
var tileSelected = null;
var timer;
var seconds = 0;
var errors = 0;
var board = [];
var solution = [];

window.onload = function() {
    generateRandomBoard();
    setGame();
    startTimer();
}

function generateRandomBoard() {
    // Generate a complete valid Sudoku board
    solution = generateCompleteBoard();
    // Create a puzzle with some numbers removed
    board = removeNumbers(solution);
}

function generateCompleteBoard() {
    // Fill the board using a backtracking algorithm
    let newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

    function fillBoard(row, col) {
        if (row === 9) return true; // All rows are filled

        let nextRow = (col === 8) ? row + 1 : row;
        let nextCol = (col + 1) % 9;

        let numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let number of numbers) {
            if (isValidPlacement(newBoard, row, col, number)) {
                newBoard[row][col] = number;
                if (fillBoard(nextRow, nextCol)) return true;
                newBoard[row][col] = 0; // Backtrack
            }
        }
        return false;
    }

    fillBoard(0, 0);
    return newBoard.map(row => row.join(""));
}

function removeNumbers(board) {
    let newBoard = board.map(row => row.split(""));
    let clues = 30; // Number of cells to leave filled

    for (let i = 0; i < 81 - clues; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (newBoard[row][col] === "-");

        newBoard[row][col] = "-";
    }
    return newBoard.map(row => row.join(""));
}

function isValidPlacement(board, row, col, number) {
    // Check the row
    if (board[row].includes(number)) return false;
    // Check the column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === number) return false;
    }
    // Check the 3x3 sub-grid
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (board[r][c] === number) return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setGame() {
    // digits 1-9
    for(let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
    // board 9*9
    for(let r = 0; r < 9; r++) {
        for(let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + '-' + c.toString();
            if(board[r][c] !== '-') {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if(r === 2 || r === 5) {
                tile.classList.add("horizontal-line");
            }
            if(c === 2 || c === 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if(numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if(numSelected) {
        if(this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if(isValidPlacement(board, r, c, parseInt(numSelected.id))) {
            this.innerText = numSelected.id;
            board[r][c] = numSelected.id;
            if (checkBoardSolved()) {
                alert("Congratulations! You solved the Sudoku puzzle!");
                reloadPage();
            }
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}

function checkBoardSolved() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function startTimer() {
    timer = setInterval(function() {
        seconds++;
        document.getElementById("timer").innerText = formatTime(seconds);
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (minutes < 10) minutes = '0' + minutes;
    if (secs < 10) secs = '0' + secs;
    return minutes + ":" + secs;
}

function reloadPage() {
    setTimeout(function() {
        location.reload();
    }, 1000);
}
