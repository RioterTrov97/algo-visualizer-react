const getRandomBool = () => Math.random() > 0.5;

export const sidewinder = (grid) => {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

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

	// Process each row of cells (at odd row indices)
	for (let row = 1; row < gridHeight - 1; row += 2) {
		let runSet = []; // Track current "run" of cells

		// Process each cell in the row (at odd column indices)
		for (let col = 1; col < gridWidth - 1; col += 2) {
			runSet.push(col);

			// For the first row, always carve east (remove right walls)
			if (row === 1) {
				if (col + 2 < gridWidth - 1) {
					// Remove wall to the right
					removeWall(row, col + 1);
				}
			} else {
				// For other rows: decide whether to carve east or close the run
				const isLastColumn = col + 2 >= gridWidth - 1;
				const shouldCarveEast = !isLastColumn && getRandomBool();

				if (shouldCarveEast) {
					// Remove wall to the right (carve east)
					removeWall(row, col + 1);
				} else {
					// Close the run: carve north from a random cell in the run
					if (runSet.length > 0) {
						const randomCellCol =
							runSet[Math.floor(Math.random() * runSet.length)];
						// Remove wall above
						removeWall(row - 1, randomCellCol);
						// Clear the run
						runSet = [];
					}
				}
			}
		}

		// If there's a remaining run at the end of the row (not first row), close it
		if (row !== 1 && runSet.length > 0) {
			const randomCellCol = runSet[Math.floor(Math.random() * runSet.length)];
			removeWall(row - 1, randomCellCol);
		}
	}

	return wallsToAnimate;
};
