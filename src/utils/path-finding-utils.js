export const getInitialGrid = (numRows = 15, numColumns = 10) => {
	const grid = [];
	const startNode = [1, 1];
	const finishNode = [numRows - 2, numColumns - 2];
	for (let row = 0; row < numRows; row++) {
		const currentRow = [];
		for (let col = 0; col < numColumns; col++) {
			currentRow.push(createNode(col, row, startNode, finishNode));
		}
		grid.push(currentRow);
	}
	return [grid, startNode, finishNode];
};

export const createNode = (col, row, startNode, finishNode) => {
	return {
		col,
		row,
		isStart: row === startNode[0] && col === startNode[1],
		isFinish: row === finishNode[0] && col === finishNode[1],
		distance: Infinity,
		isVisited: false,
		isWall: false,
		previousNode: null,
		className: 'node',
	};
};

export const getNewGridWithWallToggled = (grid, row, col, isDrawing) => {
	const node = grid[row][col];

	// Don't toggle start or finish nodes
	if (node.isStart || node.isFinish) return grid;

	// Only update if the state is actually changing
	if (node.isWall === isDrawing) return grid;

	const newGrid = grid.slice();
	const newNode = {
		...node,
		isWall: isDrawing,
		className: isDrawing ? 'node node-wall' : 'node',
	};
	newGrid[row][col] = newNode;
	return newGrid;
};

export const changeClassName = (grid, row, col, className) => {
	const node = grid[row][col];
	const newNode = {
		...node,
		className,
	};
	grid[row][col] = newNode;
	return grid;
};

// Reset visited nodes and path visualization while preserving walls
export const resetGridForNewPathfinding = (grid) => {
	const newGrid = grid.map((row) =>
		row.map((node) => ({
			...node,
			distance: Infinity,
			isVisited: false,
			previousNode: null,
			// Keep the wall status and update className based on walls
			className: node.isWall
				? 'node node-wall'
				: node.isStart
					? 'node node-start'
					: node.isFinish
						? 'node node-finish'
						: 'node',
		})),
	);
	return newGrid;
};
