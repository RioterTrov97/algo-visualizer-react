const getRandomBool = () => Math.random() > 0.5;

const fillArrayWithNum = (n, fillNum) => {
	let i = 0,
		a = Array(n);

	while (i < n) a[i++] = fillNum === 0 ? fillNum : i;
	return a;
};

const removeInArr = (arr, num) => arr.filter((item) => item !== num);

export const eller = (grid) => {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	let wallsToAnimate = [];
	const virtualGrid = [];
	const totalCols = fillArrayWithNum(Math.ceil(gridWidth / 2));

	virtualGrid[0] = [];
	virtualGrid[1] = [];
	// The first row is all walls
	for (let col = 0; col < gridWidth; col++) {
		wallsToAnimate.push(grid[0][col]);
		virtualGrid[0][col] = -1;
	}

	for (let row = 1; row < gridHeight - 1; row += 2) {
		if (row > 70) break;
		let colsAvailable = [...totalCols];
		const prevWallRow = virtualGrid[row - 1];
		const curRow = virtualGrid[row];

		const set = new Set();
		for (let col = 1; col < gridWidth; col += 2) {
			if (curRow[col] > 0) set.add(curRow[col]);
		}
		const numbersInArr = Array.from(set);
		numbersInArr.forEach(
			(item) => (colsAvailable = removeInArr(colsAvailable, item))
		);

		//fill bottom row with empty walls
		virtualGrid[row + 1] = fillArrayWithNum(gridWidth, 0);

		// The last row is different
		if (row === gridHeight - 2) {
			for (let col = 1; col < gridWidth; col += 2) {
				if (
					curRow[col] !== curRow[col + 2] &&
					curRow[col + 1] === -1 &&
					col !== gridWidth - 2
				) {
					curRow[col + 1] = 0;
					wallsToAnimate = wallsToAnimate.filter((item) => {
						if (item.row === row && item.col === col + 1) {
							return false;
						}
						return true;
					});
				}
			}

			for (let col = 0; col < gridWidth; col++) {
				if (curRow[col] === -1) {
					wallsToAnimate.push(grid[row][col]);
				}
			}

			for (let col = 0; col < gridWidth; col++) {
				wallsToAnimate.push(grid[gridHeight - 1][col]);
				virtualGrid[gridHeight - 1][col] = -1;
			}
			//break for last rows bottom wall calculation
			break;
		}

		// Step 1: Initialize empty row
		// Step 2: Join any cells not members of a set to their own unique set
		if (row === 1) {
			for (let col = 0; col < gridWidth; col++) {
				if (col === 0 || col === gridWidth - 1) {
					curRow.push(-1);
					wallsToAnimate.push(grid[row][col]);
				} else if (col % 2 !== 0) {
					curRow.push(colsAvailable[colsAvailable.length - 1]);
					colsAvailable.pop();
				} else {
					curRow.push(0);
				}
			}
		} else {
			for (let col = 0; col < gridWidth; col++) {
				if (col === 0 || col === gridWidth - 1) {
					curRow[col] = -1;
					wallsToAnimate.push(grid[row][col]);
				} else if (col % 2 !== 0) {
					if (prevWallRow[col] === -1) {
						curRow[col] = -1;
					}
				} else {
					curRow[col] = 0;
				}
			}

			for (let col = 1; col < gridWidth; col += 2) {
				if (curRow[col] === -1) {
					curRow[col] = colsAvailable[colsAvailable.length - 1];
					colsAvailable.pop();
				}
			}
		}

		// Step 3:Create right walls
		for (let col = 1; col < gridWidth; col += 2) {
			let addRightWall = getRandomBool();
			if (
				curRow[col] === curRow[col + 2] &&
				!prevWallRow[col] &&
				!prevWallRow[col + 2]
			) {
				addRightWall = true;
			}

			if (addRightWall) {
				curRow[col + 1] = -1;
				wallsToAnimate.push(grid[row][col + 1]);

				virtualGrid[row + 1][col + 1] = -1;
				wallsToAnimate.push(grid[row + 1][col + 1]);
			} else {
				if (col !== gridWidth - 2) curRow[col + 2] = curRow[col];
			}
		}

		let newSetCursor = 1;
		// Step 4:Create bottom walls
		for (let col = 1; col < gridWidth; col += 2) {
			if (col === 1) {
				virtualGrid[row + 1][col - 1] = -1;
				wallsToAnimate.push(grid[row + 1][col - 1]);
			}

			if (col === gridWidth - 2) {
				virtualGrid[row + 1][col + 1] = -1;
				wallsToAnimate.push(grid[row + 1][col + 1]);
				break;
			}

			const addBottomWall = getRandomBool();
			if (addBottomWall) {
				virtualGrid[row + 1][col + 1] = -1;
				wallsToAnimate.push(grid[row + 1][col + 1]);

				virtualGrid[row + 1][col - 1] = -1;
				wallsToAnimate.push(grid[row + 1][col - 1]);

				virtualGrid[row + 1][col] = -1;
				wallsToAnimate.push(grid[row + 1][col]);
			}

			if (curRow[col] !== curRow[col + 2]) {
				let hasAtLeastOneOpenBottom = false;
				for (let colCheck = newSetCursor; colCheck < col + 1; colCheck += 2) {
					if (hasAtLeastOneOpenBottom) break;
					if (virtualGrid[row + 1][col] === 0) hasAtLeastOneOpenBottom = true;
				}
				if (!hasAtLeastOneOpenBottom) {
					virtualGrid[row + 1][col] = 0;
					wallsToAnimate.pop();
				}
				newSetCursor = col + 2;
			}
		}

		// Step 5: Create a new row.
		virtualGrid[row] = curRow;
		virtualGrid[row + 2] = curRow;
	}

	return wallsToAnimate;
};
