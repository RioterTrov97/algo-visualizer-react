const getRandomElement = (array) => {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
};

export const prims = (grid) => {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	const wallsSet = new Set();
	const wallsToAnimate = [];

	// Initialize: Mark all cells as walls initially
	for (let row = 0; row < gridHeight; row++) {
		for (let col = 0; col < gridWidth; col++) {
			const node = grid[row][col];
			if (!node.isStart && !node.isFinish) {
				wallsToAnimate.push(node);
				wallsSet.add(`${row},${col}`);
			}
		}
	}

	// Helper function to remove wall efficiently
	const removeWall = (row, col) => {
		const key = `${row},${col}`;
		if (wallsSet.has(key)) {
			wallsSet.delete(key);
			const index = wallsToAnimate.findIndex(
				(item) => item.row === row && item.col === col,
			);
			if (index !== -1) {
				wallsToAnimate.splice(index, 1);
			}
		}
	};

	// Start from a random cell at odd coordinates
	const startRow =
		Math.floor(Math.random() * Math.floor(gridHeight / 2)) * 2 + 1;
	const startCol =
		Math.floor(Math.random() * Math.floor(gridWidth / 2)) * 2 + 1;

	// Mark starting cell as passage
	removeWall(startRow, startCol);

	// List to track walls adjacent to visited cells
	const frontierWalls = [];
	const visitedCells = new Set();
	visitedCells.add(`${startRow},${startCol}`);

	// Add walls around starting cell
	const addFrontierWalls = (row, col) => {
		const directions = [
			{ dr: -2, dc: 0, wallDr: -1, wallDc: 0 }, // Up
			{ dr: 2, dc: 0, wallDr: 1, wallDc: 0 }, // Down
			{ dr: 0, dc: -2, wallDr: 0, wallDc: -1 }, // Left
			{ dr: 0, dc: 2, wallDr: 0, wallDc: 1 }, // Right
		];

		for (const { dr, dc, wallDr, wallDc } of directions) {
			const newRow = row + dr;
			const newCol = col + dc;
			const wallRow = row + wallDr;
			const wallCol = col + wallDc;

			// Check if neighbor cell is within bounds and not visited
			if (
				newRow > 0 &&
				newRow < gridHeight - 1 &&
				newCol > 0 &&
				newCol < gridWidth - 1 &&
				!visitedCells.has(`${newRow},${newCol}`)
			) {
				frontierWalls.push({
					wallRow,
					wallCol,
					cellRow: newRow,
					cellCol: newCol,
				});
			}
		}
	};

	addFrontierWalls(startRow, startCol);

	// Prim's algorithm main loop
	while (frontierWalls.length > 0) {
		// Pick a random wall from the frontier
		const randomIndex = Math.floor(Math.random() * frontierWalls.length);
		const { wallRow, wallCol, cellRow, cellCol } = frontierWalls[randomIndex];
		frontierWalls.splice(randomIndex, 1);

		// If the cell on the other side hasn't been visited
		if (!visitedCells.has(`${cellRow},${cellCol}`)) {
			// Remove the wall and mark the cell as passage
			removeWall(wallRow, wallCol);
			removeWall(cellRow, cellCol);
			visitedCells.add(`${cellRow},${cellCol}`);

			// Add new frontier walls
			addFrontierWalls(cellRow, cellCol);
		}
	}

	return wallsToAnimate;
};
