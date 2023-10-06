document.addEventListener("DOMContentLoaded", function () {
    // Define variables for grid size and cell size
    const numColumns = 100; // Number of columns
    const numRows = 45;    // Number of rows
    const cellSize = 14;   // Cell size in pixels

    // Get references to HTML elements
    const grid = document.getElementById('grid');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const clearButton = document.getElementById('clearButton');
    let gridArray = createEmptyGrid();

    // Function to create an empty grid
    function createEmptyGrid() {
        const gridArray = new Array(numColumns);
        for (let i = 0; i < numColumns; i++) {
            gridArray[i] = new Array(numRows).fill(0); // 0 represents dead
        }
        return gridArray;
    }

    // Function to create a cell element and add click event
    function createCell(x, y) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => toggleCell(x, y));
        return cell;
    }

    // Function to toggle cell state between alive and dead
    function toggleCell(x, y) {
        gridArray[x][y] = (gridArray[x][y] === 0) ? 1 : 0;
        updateCellView(x, y);
    }

    // Function to update cell's visual state
    function updateCellView(x, y) {
        const cell = document.querySelector(`.grid .cell:nth-child(${x + 1 + y * numColumns})`);
        cell.classList.remove('alive', 'dying');
        if (gridArray[x][y] === 1) {
            cell.classList.add('alive');
        } else if (gridArray[x][y] === 2) {
            cell.classList.add('dying');
        }
    }

    // Function to update the grid's state based on rules
    function updateGrid() {
        const newGridArray = createEmptyGrid();
        for (let x = 0; x < numColumns; x++) {
            for (let y = 0; y < numRows; y++) {
                const neighbors = countNeighbors(x, y);
                if (gridArray[x][y] === 1) {
                    newGridArray[x][y] = 2; // Transition from alive (1) to dying (2)
                } else if (gridArray[x][y] === 0 && neighbors === 2) {
                    newGridArray[x][y] = 1; // Transition from dead (0) to alive (1)
                }
                updateCellView(x, y);
            }
        }
        gridArray = newGridArray;
    }

    // Function to count the number of alive neighbors
    function countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newX = x + i;
                const newY = y + j;
                if (newX >= 0 && newX < numColumns && newY >= 0 && newY < numRows) {
                    count += gridArray[newX][newY] === 1 ? 1 : 0;
                }
            }
        }
        return count;
    }

    // Function to start the simulation
    function startGame() {
        interval = setInterval(updateGrid, 50); // Adjust the interval as desired
    }

    // Function to stop the simulation
    function stopGame() {
        clearInterval(interval);
    }

    // Function to clear the grid
    function clearGrid() {
        
        
        gridArray = createEmptyGrid();
        const cells = document.querySelectorAll('.grid .cell');
        cells.forEach(cell => cell.classList.remove('alive', 'dying'));
        clearInterval(interval);
    }

    // Create the grid based on numColumns, numRows, and cellSize
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numColumns; x++) {
            const cell = createCell(x, y);
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            grid.appendChild(cell);
        }
    }

    // Add event listeners to buttons
    startButton.addEventListener('click', startGame);
    stopButton.addEventListener('click', stopGame);
    clearButton.addEventListener('click', clearGrid);
});
