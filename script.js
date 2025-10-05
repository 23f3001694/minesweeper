class Minesweeper {
    constructor() {
        this.board = [];
        this.gameState = 'playing'; // 'playing', 'won', 'lost'
        this.startTime = null;
        this.timer = null;
        this.flagCount = 0;

        // Difficulty settings
        this.difficulties = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };

        this.currentDifficulty = 'easy';
        this.config = this.difficulties[this.currentDifficulty];

        this.initializeElements();
        this.bindEvents();
        this.newGame();
    }

    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.mineCountElement = document.getElementById('mine-count');
        this.flagCountElement = document.getElementById('flag-count');
        this.timerElement = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty');
        this.newGameButton = document.getElementById('new-game');
        this.gameOverElement = document.getElementById('game-over');
        this.gameOverTitle = document.getElementById('game-over-title');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.playAgainButton = document.getElementById('play-again');
    }

    bindEvents() {
        this.newGameButton.addEventListener('click', () => this.newGame());
        this.playAgainButton.addEventListener('click', () => this.newGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.config = this.difficulties[this.currentDifficulty];
            this.newGame();
        });

        // Prevent context menu on right click
        this.gameBoard.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    newGame() {
        this.gameState = 'playing';
        this.flagCount = 0;
        this.startTime = null;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.updateDisplay();
        this.hideGameOver();
        this.createBoard();
        this.renderBoard();
    }

    createBoard() {
        // Initialize empty board
        this.board = [];
        for (let row = 0; row < this.config.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.config.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborCount: 0,
                    row: row,
                    col: col
                };
            }
        }

        // Place mines randomly
        this.placeMines();

        // Calculate neighbor counts
        this.calculateNeighborCounts();
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.config.mines) {
            const row = Math.floor(Math.random() * this.config.rows);
            const col = Math.floor(Math.random() * this.config.cols);

            if (!this.board[row][col].isMine) {
                this.board[row][col].isMine = true;
                minesPlaced++;
            }
        }
    }

    calculateNeighborCounts() {
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                if (!this.board[row][col].isMine) {
                    this.board[row][col].neighborCount = this.countNeighborMines(row, col);
                }
            }
        }
    }

    countNeighborMines(row, col) {
        let count = 0;
        for (let r = Math.max(0, row - 1); r <= Math.min(this.config.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.config.cols - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    if (this.board[r][c].isMine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${this.currentDifficulty}`;

        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const cell = this.createCellElement(row, col);
                this.gameBoard.appendChild(cell);
            }
        }
    }

    createCellElement(row, col) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCellClick(row, col);
        });

        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleCellRightClick(row, col);
        });

        // Handle mobile long press for flagging
        let touchTimer = null;
        cell.addEventListener('touchstart', (e) => {
            touchTimer = setTimeout(() => {
                this.handleCellRightClick(row, col);
            }, 500);
        });

        cell.addEventListener('touchend', (e) => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });

        cell.addEventListener('touchmove', (e) => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });

        return cell;
    }

    handleCellClick(row, col) {
        if (this.gameState !== 'playing') return;

        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        // Start timer on first click
        if (!this.startTime) {
            this.startTimer();
        }

        if (cell.isMine) {
            this.gameOver(false);
            return;
        }

        this.revealCell(row, col);
        this.updateCellDisplay(row, col);

        // Auto-reveal neighbors if no neighboring mines
        if (cell.neighborCount === 0) {
            this.revealNeighbors(row, col);
        }

        this.checkWinCondition();
    }

    handleCellRightClick(row, col) {
        if (this.gameState !== 'playing') return;

        const cell = this.board[row][col];
        if (cell.isRevealed) return;

        // Start timer on first action
        if (!this.startTime) {
            this.startTimer();
        }

        cell.isFlagged = !cell.isFlagged;
        this.flagCount += cell.isFlagged ? 1 : -1;

        this.updateCellDisplay(row, col);
        this.updateDisplay();
    }

    revealCell(row, col) {
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        this.updateCellDisplay(row, col);
    }

    revealNeighbors(row, col) {
        for (let r = Math.max(0, row - 1); r <= Math.min(this.config.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.config.cols - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    const neighborCell = this.board[r][c];
                    if (!neighborCell.isRevealed && !neighborCell.isFlagged && !neighborCell.isMine) {
                        this.revealCell(r, c);
                        if (neighborCell.neighborCount === 0) {
                            this.revealNeighbors(r, c);
                        }
                    }
                }
            }
        }
    }

    updateCellDisplay(row, col) {
        const cell = this.board[row][col];
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        // Reset classes
        cellElement.className = 'cell';
        cellElement.textContent = '';
        cellElement.removeAttribute('data-number');

        if (cell.isFlagged) {
            cellElement.classList.add('flagged');
        } else if (cell.isRevealed) {
            cellElement.classList.add('revealed');

            if (cell.isMine) {
                cellElement.classList.add('mine');
                cellElement.textContent = '💣';
                if (this.gameState === 'lost') {
                    cellElement.classList.add('exploded');
                }
            } else if (cell.neighborCount > 0) {
                cellElement.textContent = cell.neighborCount;
                cellElement.setAttribute('data-number', cell.neighborCount);
            }
        }
    }

    checkWinCondition() {
        let revealedCount = 0;
        let totalCells = this.config.rows * this.config.cols;

        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                if (this.board[row][col].isRevealed) {
                    revealedCount++;
                }
            }
        }

        if (revealedCount === totalCells - this.config.mines) {
            this.gameOver(true);
        }
    }

    gameOver(won) {
        this.gameState = won ? 'won' : 'lost';

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Reveal all cells
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.cols; col++) {
                const cell = this.board[row][col];

                if (!won) {
                    // Show all mines and wrong flags
                    if (cell.isMine && !cell.isFlagged) {
                        cell.isRevealed = true;
                    } else if (!cell.isMine && cell.isFlagged) {
                        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        cellElement.classList.add('wrong-flag');
                    }
                }

                this.updateCellDisplay(row, col);
            }
        }

        this.showGameOver(won);
    }

    showGameOver(won) {
        const elapsedTime = this.getElapsedTime();

        if (won) {
            this.gameOverTitle.textContent = '🎉 Congratulations!';
            this.gameOverMessage.textContent = `You won in ${elapsedTime} seconds!`;
        } else {
            this.gameOverTitle.textContent = '💥 Game Over!';
            this.gameOverMessage.textContent = 'Better luck next time!';
        }

        this.gameOverElement.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameOverElement.classList.add('hidden');
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 100);
    }

    updateTimer() {
        if (!this.startTime) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerElement.textContent = elapsed.toString().padStart(3, '0');
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    updateDisplay() {
        this.mineCountElement.textContent = this.config.mines;
        this.flagCountElement.textContent = this.flagCount;

        if (!this.startTime) {
            this.timerElement.textContent = '000';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
