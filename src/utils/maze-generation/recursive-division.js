export const recursiveDivisionMaze = (
	grid,
	rowStart,
	rowEnd,
	colStart,
	colEnd,
	surroundingWalls,
	wallsToAnimate,
	orientation,
) => {
	if (rowEnd < rowStart || colEnd < colStart) {
		return;
	}

	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	if (!surroundingWalls) {
		for (let row = 0; row < gridHeight; row++) {
			for (let col = 0; col < gridWidth; col++) {
				if (
					row === 0 ||
					col === 0 ||
					row === gridHeight - 1 ||
					col === gridWidth - 1
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

		for (let row = 0; row < gridHeight; row++) {
			for (let col = 0; col < gridWidth; col++) {
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
			currentRow - 2 - rowStart > colEnd - colStart ? 'horizontal' : 'vertical',
		);
		recursiveDivisionMaze(
			grid,
			currentRow + 2,
			rowEnd,
			colStart,
			colEnd,
			surroundingWalls,
			wallsToAnimate,
			rowEnd - (currentRow + 2) > colEnd - colStart ? 'horizontal' : 'vertical',
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

		for (let row = 0; row < gridHeight; row++) {
			for (let col = 0; col < gridWidth; col++) {
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
			rowEnd - rowStart > currentColumn - 2 - colStart
				? 'horizontal'
				: 'vertical',
		);

		recursiveDivisionMaze(
			grid,
			rowStart,
			rowEnd,
			currentColumn + 2,
			colEnd,
			surroundingWalls,
			wallsToAnimate,
			rowEnd - rowStart > colEnd - (currentColumn + 2)
				? 'horizontal'
				: 'vertical',
		);
	}

	return wallsToAnimate;
};
