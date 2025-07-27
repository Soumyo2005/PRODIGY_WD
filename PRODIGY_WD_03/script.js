document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const pvpBtn = document.getElementById('pvp-btn');
    const pvcBtn = document.getElementById('pvc-btn');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pvc'
    let xWins = 0;
let oWins = 0;
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ];
    
    // Initialize the game board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already filled or game not active, ignore click
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state and UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
  function checkResult() {
    let roundWon = false;
    let winningCombination = null;
    
    // Check all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            winningCombination = winningConditions[i];
            break;
        }
    }
    
    // If won, end game and apply winning styles
    if (roundWon) {
        // Highlight winning cells
        winningCombination.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('winning-cell');
        });
        
        // Highlight status message
        status.textContent = `Player ${currentPlayer} wins!`;
        status.classList.add('winning-status');
        
        // Update win count
        if (currentPlayer === 'X') {
            xWins++;
            document.getElementById('score-x').textContent = `Player X: ${xWins} win${xWins !== 1 ? 's' : ''}`;
            document.getElementById('score-x').classList.add('winning-status');
        } else {
            oWins++;
            document.getElementById('score-o').textContent = `Player O: ${oWins} win${oWins !== 1 ? 's' : ''}`;
            document.getElementById('score-o').classList.add('winning-status');
        }
        
        gameActive = false;
        return;
    }
    
    // Rest of your existing checkResult code...
    
    // Rest of the function remains the same...

        // If all cells filled (draw)
        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }
        
        // If game continues, change player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        // If in PVC mode and it's computer's turn
        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500);
        }
    }
    
    // Computer's move (simple AI)
    function computerMove() {
        if (!gameActive) return;
        
        // Try to win if possible
        let move = findWinningMove('O');
        if (move === -1) {
            // Block player from winning
            move = findWinningMove('X');
            if (move === -1) {
                // Choose center if available
                if (gameState[4] === '') {
                    move = 4;
                } else {
                    // Choose random available cell
                    const availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
                    move = availableCells[Math.floor(Math.random() * availableCells.length)];
                }
            }
        }
        
        if (move !== -1 && move !== undefined) {
            const cell = document.querySelector(`.cell[data-index="${move}"]`);
            gameState[move] = 'O';
            cell.textContent = 'O';
            cell.classList.add('o');
            checkResult();
        }
    }
    
    // Find a winning move for the given player
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            // Check if two cells are filled by player and third is empty
            if (gameState[a] === player && gameState[b] === player && gameState[c] === '') {
                return c;
            }
            if (gameState[a] === player && gameState[c] === player && gameState[b] === '') {
                return b;
            }
            if (gameState[b] === player && gameState[c] === player && gameState[a] === '') {
                return a;
            }
        }
        return -1;
    }
    
function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = `Player ${currentPlayer}'s turn`;
    
    // Remove all winning styles
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
    
    status.classList.remove('winning-status');
    document.getElementById('score-x').classList.remove('winning-status');
    document.getElementById('score-o').classList.remove('winning-status');
    
    // Remove any winning lines if you have them
    document.querySelectorAll('.winning-line').forEach(el => el.remove());
}
    
    // Set game mode
    function setGameMode(mode) {
        gameMode = mode;
        if (mode === 'pvp') {
            pvpBtn.classList.add('active');
            pvcBtn.classList.remove('active');
        } else {
            pvpBtn.classList.remove('active');
            pvcBtn.classList.add('active');
        }
        resetGame();
    }
    
    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    pvpBtn.addEventListener('click', () => setGameMode('pvp'));
    pvcBtn.addEventListener('click', () => setGameMode('pvc'));
    
    // Initialize the game
    initializeBoard();
});