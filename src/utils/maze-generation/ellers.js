const getRandomBool = () => Math.random() > 0.5;

export const eller = (grid) => {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	// Use a Set to track walls instead of array for O(1) removal
	const wallsSet = new Set();
	const wallsToAnimate = [];

	// Initialize: Mark all even rows/cols as walls (the grid structure)
	for (let row = 0; row < gridHeight; row++) {
		for (let col = 0; col < gridWidth; col++) {
			// All edges are walls
			if (
				row === 0 ||
				row === gridHeight - 1 ||
				col === 0 ||
				col === gridWidth - 1
			) {
				wallsToAnimate.push(grid[row][col]);
				wallsSet.add(`${row},${col}`);
			}
			// All even rows and columns are walls (the structural walls)
			else if (row % 2 === 0 || col % 2 === 0) {
				wallsToAnimate.push(grid[row][col]);
				wallsSet.add(`${row},${col}`);
			}
		}
	}

	// Eller's algorithm: work with cells at odd row/col positions
	const cellGrid = []; // Track which cells belong to the same set
	let setCounter = 1;

	// Initialize first row of cells
	cellGrid[0] = [];
	for (let col = 1; col < gridWidth; col += 2) {
		cellGrid[0][col] = setCounter++;
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

	// Process each row of cells
	for (let cellRow = 1; cellRow < Math.ceil(gridHeight / 2); cellRow++) {
		const row = cellRow * 2 - 1; // Convert to actual grid row
		if (row >= gridHeight - 1) break;

		cellGrid[cellRow] = [];

		// Step 1: Assign sets to cells in this row
		for (let col = 1; col < gridWidth; col += 2) {
			// Check if there's an opening from above
			const wallAbove = row - 1;
			const hasOpeningAbove =
				wallAbove >= 0 && !wallsSet.has(`${wallAbove},${col}`);

			if (
				hasOpeningAbove &&
				cellGrid[cellRow - 1] &&
				cellGrid[cellRow - 1][col]
			) {
				// Continue same set from above
				cellGrid[cellRow][col] = cellGrid[cellRow - 1][col];
			} else {
				// New set
				cellGrid[cellRow][col] = setCounter++;
			}
		}

		// Step 2: Randomly join/separate adjacent cells (remove right walls)
		for (let col = 1; col < gridWidth - 2; col += 2) {
			const rightWallCol = col + 1;
			const shouldRemoveWall = getRandomBool();
			const leftSet = cellGrid[cellRow][col];
			const rightSet = cellGrid[cellRow][col + 2];

			if (shouldRemoveWall && leftSet !== rightSet) {
				// Remove the wall between them
				removeWall(row, rightWallCol);
				// Merge sets: change all rightSet to leftSet
				for (let c = 1; c < gridWidth; c += 2) {
					if (cellGrid[cellRow][c] === rightSet) {
						cellGrid[cellRow][c] = leftSet;
					}
				}
			}
		}

		// Check if this is the last row
		const nextRow = row + 2;
		if (nextRow >= gridHeight - 1) {
			// Last row: connect all different sets
			for (let col = 1; col < gridWidth - 2; col += 2) {
				const rightWallCol = col + 1;
				if (cellGrid[cellRow][col] !== cellGrid[cellRow][col + 2]) {
					// Remove wall to connect
					removeWall(row, rightWallCol);
					// Merge sets
					const toReplace = cellGrid[cellRow][col + 2];
					const toKeep = cellGrid[cellRow][col];
					for (let c = 1; c < gridWidth; c += 2) {
						if (cellGrid[cellRow][c] === toReplace) {
							cellGrid[cellRow][c] = toKeep;
						}
					}
				}
			}
			break;
		}

		// Step 3: Randomly remove bottom walls, ensuring each set has at least one opening
		const setHasOpening = {};

		// First pass: randomly remove walls
		for (let col = 1; col < gridWidth; col += 2) {
			const setId = cellGrid[cellRow][col];
			const shouldRemoveBottomWall = getRandomBool();

			if (shouldRemoveBottomWall) {
				// Remove the wall below
				const wallBelow = row + 1;
				removeWall(wallBelow, col);
				setHasOpening[setId] = true;
			}
		}

		// Second pass: ensure every set has at least one opening
		for (let col = 1; col < gridWidth; col += 2) {
			const setId = cellGrid[cellRow][col];
			if (!setHasOpening[setId]) {
				// Force an opening for this set
				const wallBelow = row + 1;
				removeWall(wallBelow, col);
				setHasOpening[setId] = true;
			}
		}
	}

	return wallsToAnimate;
};
