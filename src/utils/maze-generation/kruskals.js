// Disjoint Set (Union-Find) data structure
class DisjointSet {
	constructor() {
		this.parent = {};
		this.rank = {};
	}

	makeSet(item) {
		this.parent[item] = item;
		this.rank[item] = 0;
	}

	find(item) {
		if (this.parent[item] !== item) {
			this.parent[item] = this.find(this.parent[item]); // Path compression
		}
		return this.parent[item];
	}

	union(item1, item2) {
		const root1 = this.find(item1);
		const root2 = this.find(item2);

		if (root1 !== root2) {
			// Union by rank
			if (this.rank[root1] > this.rank[root2]) {
				this.parent[root2] = root1;
			} else if (this.rank[root1] < this.rank[root2]) {
				this.parent[root1] = root2;
			} else {
				this.parent[root2] = root1;
				this.rank[root1]++;
			}
			return true;
		}
		return false;
	}
}

const shuffleArray = (array) => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const kruskals = (grid) => {
	const gridHeight = grid.length;
	const gridWidth = grid[0].length;

	const wallsSet = new Set();
	const wallsToAnimate = [];

	// Initialize: Mark all cells as walls
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

	// Create list of all cells (at odd coordinates)
	const cells = [];
	for (let row = 1; row < gridHeight - 1; row += 2) {
		for (let col = 1; col < gridWidth - 1; col += 2) {
			cells.push({ row, col });
			removeWall(row, col); // Mark cells as passages
		}
	}

	// Create disjoint set for cells
	const disjointSet = new DisjointSet();
	cells.forEach((cell) => {
		disjointSet.makeSet(`${cell.row},${cell.col}`);
	});

	// Create list of all walls between cells
	const walls = [];
	for (let row = 1; row < gridHeight - 1; row += 2) {
		for (let col = 1; col < gridWidth - 1; col += 2) {
			// Check wall to the right
			if (col + 2 < gridWidth - 1) {
				walls.push({
					wallRow: row,
					wallCol: col + 1,
					cell1Row: row,
					cell1Col: col,
					cell2Row: row,
					cell2Col: col + 2,
				});
			}
			// Check wall below
			if (row + 2 < gridHeight - 1) {
				walls.push({
					wallRow: row + 1,
					wallCol: col,
					cell1Row: row,
					cell1Col: col,
					cell2Row: row + 2,
					cell2Col: col,
				});
			}
		}
	}

	// Shuffle walls to process them randomly
	const shuffledWalls = shuffleArray(walls);

	// Kruskal's algorithm main loop
	for (const wall of shuffledWalls) {
		const { wallRow, wallCol, cell1Row, cell1Col, cell2Row, cell2Col } = wall;
		const cell1Key = `${cell1Row},${cell1Col}`;
		const cell2Key = `${cell2Row},${cell2Col}`;

		// If the two cells are in different sets, remove the wall
		if (disjointSet.union(cell1Key, cell2Key)) {
			removeWall(wallRow, wallCol);
		}
	}

	return wallsToAnimate;
};
