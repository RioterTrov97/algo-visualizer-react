import { getUnvisitedNeighbors } from './helpers';

// Breadth-First Search - explores level by level from the start node
// Guarantees finding the shortest path in unweighted graphs
export function bfs(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	const queue = [startNode];
	startNode.distance = 0;

	while (queue.length) {
		const currentNode = queue.shift();

		if (currentNode.isWall) continue;
		if (currentNode.isVisited) continue;

		currentNode.isVisited = true;
		visitedNodesInOrder.push(currentNode);

		if (currentNode === finishNode) return visitedNodesInOrder;

		const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
		for (const neighbor of unvisitedNeighbors) {
			if (!neighbor.isVisited) {
				neighbor.distance = currentNode.distance + 1;
				neighbor.previousNode = currentNode;
				queue.push(neighbor);
			}
		}
	}

	return visitedNodesInOrder;
}
