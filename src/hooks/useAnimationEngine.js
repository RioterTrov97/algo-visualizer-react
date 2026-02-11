import {
	changeClassName,
	getNewGridWithWallToggled,
} from '../utils/path-finding-utils';
import {
	dijkstra,
	getNodesInShortestPathOrder,
	aStar,
	bfs,
	greedyBestFirst,
} from '../utils/path-finding';

const NODES_PER_FRAME = 100; // Number of nodes to animate per frame

export const useAnimationEngine = (
	state,
	setState,
	animationSpeed,
	resetAndAnimateType,
) => {
	const animateWithRAF = (nodes, className, onComplete) => {
		let currentIndex = 0;
		let lastUpdateTime = 0;
		const batchSize = Math.ceil(nodes.length / NODES_PER_FRAME); // Batch updates to reduce re-renders

		const animate = (timestamp) => {
			if (lastUpdateTime === 0) lastUpdateTime = timestamp;
			const elapsed = timestamp - lastUpdateTime;

			if (elapsed >= animationSpeed) {
				// Update multiple nodes in one batch
				let gridUpdates = state.grid;
				for (let i = 0; i < batchSize && currentIndex < nodes.length; i++) {
					const node = nodes[currentIndex];
					const newClassName = node.className + ' ' + className;
					gridUpdates = changeClassName(
						gridUpdates,
						node.row,
						node.col,
						newClassName,
					);
					currentIndex++;
				}

				setState((prevState) => ({ ...prevState, grid: gridUpdates }));
				lastUpdateTime = timestamp;

				if (currentIndex >= nodes.length) {
					if (onComplete) onComplete();
					return;
				}
			}

			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	};

	const animateWalls = (wallsToAnimate, onComplete) => {
		let currentIndex = 0;
		let lastUpdateTime = 0;
		const batchSize = Math.ceil(wallsToAnimate.length / 100); // Batch updates to reduce re-renders

		const animate = (timestamp) => {
			if (lastUpdateTime === 0) lastUpdateTime = timestamp;
			const elapsed = timestamp - lastUpdateTime;

			if (elapsed >= animationSpeed) {
				// Update multiple walls in one batch
				let gridUpdates = state.grid;
				for (
					let i = 0;
					i < batchSize && currentIndex < wallsToAnimate.length;
					i++
				) {
					const wallNode = wallsToAnimate[currentIndex];
					gridUpdates = getNewGridWithWallToggled(
						gridUpdates,
						wallNode.row,
						wallNode.col,
						true,
					);
					currentIndex++;
				}

				setState((prevState) => ({ ...prevState, grid: gridUpdates }));
				lastUpdateTime = timestamp;

				if (currentIndex >= wallsToAnimate.length) {
					if (onComplete) onComplete();
					return;
				}
			}

			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	};

	const animateShortestPath = (nodesInShortestPathOrder) => {
		// Calculate directions for each node in the path based on the NEXT node
		const nodesWithDirection = nodesInShortestPathOrder.map((node, index) => {
			// If this is the last node, use the direction from the previous step
			if (index === nodesInShortestPathOrder.length - 1) {
				if (index === 0) return { ...node, direction: null };
				const prevNode = nodesInShortestPathOrder[index - 1];
				const rowDiff = node.row - prevNode.row;
				const colDiff = node.col - prevNode.col;

				let direction = 'right';
				if (rowDiff < 0) direction = 'up';
				else if (rowDiff > 0) direction = 'down';
				else if (colDiff < 0) direction = 'left';
				else if (colDiff > 0) direction = 'right';

				return { ...node, direction };
			}

			// Look at the NEXT node to determine direction
			const nextNode = nodesInShortestPathOrder[index + 1];
			const rowDiff = nextNode.row - node.row;
			const colDiff = nextNode.col - node.col;

			let direction = 'right'; // default
			if (rowDiff < 0) direction = 'up';
			else if (rowDiff > 0) direction = 'down';
			else if (colDiff < 0) direction = 'left';
			else if (colDiff > 0) direction = 'right';

			return { ...node, direction };
		});

		let currentIndex = 0;
		let lastUpdateTime = 0;
		const batchSize = Math.ceil(nodesWithDirection.length / NODES_PER_FRAME);

		const animate = (timestamp) => {
			if (lastUpdateTime === 0) lastUpdateTime = timestamp;
			const elapsed = timestamp - lastUpdateTime;

			if (elapsed >= animationSpeed) {
				let gridUpdates = state.grid;
				for (
					let i = 0;
					i < batchSize && currentIndex < nodesWithDirection.length;
					i++
				) {
					const node = nodesWithDirection[currentIndex];
					const newClassName = node.className + ' node-shortest-path';

					// Update the node with className and direction
					const updatedNode = {
						...gridUpdates[node.row][node.col],
						className: newClassName,
						direction: node.direction,
					};
					gridUpdates = gridUpdates.slice();
					gridUpdates[node.row][node.col] = updatedNode;
					currentIndex++;
				}

				setState((prevState) => ({ ...prevState, grid: gridUpdates }));
				lastUpdateTime = timestamp;

				if (currentIndex >= nodesWithDirection.length) {
					setState((prevState) => ({
						...prevState,
						isAnimating: false,
						isPathAnimationFinished: true,
					}));
					return;
				}
			}

			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	};

	const animatedNodes = (visitedNodesInOrder, nodesInShortestPathOrder) => {
		setState((prevState) => ({ ...prevState, isAnimating: true }));
		animateWithRAF(visitedNodesInOrder, 'node-visited', () => {
			animateShortestPath(nodesInShortestPathOrder);
		});
		resetAndAnimateType.current = null;
	};

	const visualizePathfinding = (algorithmFn) => {
		const grid = state.grid;
		const startNode = grid[state.startNode[0]][state.startNode[1]];
		const finishNode = grid[state.finishNode[0]][state.finishNode[1]];
		const visitedNodesInOrder = algorithmFn(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		animatedNodes(visitedNodesInOrder, nodesInShortestPathOrder);
	};

	const visualizeDijkstra = () => visualizePathfinding(dijkstra);
	const visualizeAStar = () => visualizePathfinding(aStar);
	const visualizeBFS = () => visualizePathfinding(bfs);
	const visualizeGreedyBestFirst = () => visualizePathfinding(greedyBestFirst);

	return {
		animateWithRAF,
		animateWalls,
		animateShortestPath,
		animatedNodes,
		visualizeDijkstra,
		visualizeAStar,
		visualizeBFS,
		visualizeGreedyBestFirst,
	};
};
