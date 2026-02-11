import { getUnvisitedNeighbors, heuristic } from './helpers';

// Greedy Best-First Search - uses only heuristic distance (no actual cost)
// Faster than A* but doesn't guarantee the shortest path
export function greedyBestFirst(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	startNode.distance = 0;
	startNode.heuristicDistance = heuristic(startNode, finishNode);
	const openSet = [startNode]; // Nodes to be evaluated

	while (openSet.length > 0) {
		// Sort by heuristic and get the most promising node
		sortNodesByHeuristic(openSet, finishNode);
		const closestNode = openSet.shift();

		if (closestNode.isWall) continue;
		if (closestNode.isVisited) continue;

		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);

		if (closestNode === finishNode) return visitedNodesInOrder;

		const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
		for (const neighbor of unvisitedNeighbors) {
			if (!neighbor.isVisited) {
				neighbor.distance = closestNode.distance + 1;
				neighbor.heuristicDistance = heuristic(neighbor, finishNode);
				neighbor.previousNode = closestNode;
				// Add to open set if not already there
				if (!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				}
			}
		}
	}

	return visitedNodesInOrder;
}

function sortNodesByHeuristic(unvisitedNodes, finishNode) {
	unvisitedNodes.sort((nodeA, nodeB) => {
		const hA = heuristic(nodeA, finishNode);
		const hB = heuristic(nodeB, finishNode);
		return hA - hB;
	});
}
