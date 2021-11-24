export const recursiveDivisionMaze = (
	grid,
	rowStart,
	rowEnd,
	colStart,
	colEnd,
	surroundingWalls,
	wallsToAnimate,
	orientation
) => {
	if (rowEnd < rowStart || colEnd < colStart) {
		return;
	}

	const gridWidth = grid.length;
	const gridHeight = grid[0].length;

	if (!surroundingWalls) {
		for (let row = 0; row < gridWidth; row++) {
			for (let col = 0; col < gridHeight; col++) {
				if (
					row === 0 ||
					col === 0 ||
					row === gridWidth - 1 ||
					col === gridHeight - 1
				) {
					wallsToAnimate.push(grid[row][col]);
				}
			}
		}
		surroundingWalls = true;
	}

	if (orientation === 'horizontal') {
		//finding all possible rows and columns
		let possibleRows = [];
		for (let number = rowStart; number <= rowEnd; number += 2) {
			possibleRows.push(number);
		}
		let possibleCols = [];
		for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
			possibleCols.push(number);
		}

		//choosing a random node to pass through
		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
		let currentRow = possibleRows[randomRowIndex];
		let currentColumn = possibleCols[randomColIndex];

		for (let row = 0; row < gridWidth; row++) {
			for (let col = 0; col < gridHeight; col++) {
				if (
					row === currentRow &&
					col !== currentColumn &&
					col >= colStart - 1 &&
					col <= colEnd + 1
				) {
					const node = grid[row][col];
					if (!node.isStart && !node.isFinish) {
						wallsToAnimate.push(grid[row][col]);
					}
				}
			}
		}

		recursiveDivisionMaze(
			grid,
			rowStart,
			currentRow - 2,
			colStart,
			colEnd,
			surroundingWalls,
			wallsToAnimate,
			currentRow - 2 - rowStart > colEnd - colStart ? orientation : 'vertical'
		);
		recursiveDivisionMaze(
			grid,
			currentRow + 2,
			rowEnd,
			colStart,
			colEnd,
			surroundingWalls,
			wallsToAnimate,
			rowEnd - (currentRow + 2) > colEnd - colStart ? orientation : 'vertical'
		);
	} else {
		//finding all possible rows and columns
		let possibleRows = [];
		for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
			possibleRows.push(number);
		}
		let possibleCols = [];
		for (let number = colStart; number <= colEnd; number += 2) {
			possibleCols.push(number);
		}

		//choosing a random node to pass through
		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
		let currentRow = possibleRows[randomRowIndex];
		let currentColumn = possibleCols[randomColIndex];

		for (let row = 0; row < gridWidth; row++) {
			for (let col = 0; col < gridHeight; col++) {
				if (
					col === currentColumn &&
					row !== currentRow &&
					row >= rowStart - 1 &&
					row <= rowEnd + 1
				) {
					const node = grid[row][col];
					if (!node.isStart && !node.isFinish) {
						wallsToAnimate.push(grid[row][col]);
					}
				}
			}
		}

		recursiveDivisionMaze(
			grid,
			rowStart,
			rowEnd,
			colStart,
			currentColumn - 2,
			surroundingWalls,
			wallsToAnimate,
			currentRow - 2 - rowStart > colEnd - colStart ? 'horizontal' : orientation
		);

		recursiveDivisionMaze(
			grid,
			rowStart,
			rowEnd,
			currentColumn + 2,
			colEnd,
			surroundingWalls,
			wallsToAnimate,
			rowEnd - (currentRow + 2) > colEnd - colStart ? 'horizontal' : orientation
		);
	}

	return wallsToAnimate;
};
