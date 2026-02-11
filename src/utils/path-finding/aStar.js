import { getAllNodes, getUnvisitedNeighbors, heuristic } from './helpers';

// A* algorithm - uses heuristic (Manhattan distance) combined with actual cost
// for faster and more efficient pathfinding compared to Dijkstra
export function aStar(grid, startNode, finishNode) {
	const visitedNodesInOrder = [];
	startNode.distance = 0;
	startNode.heuristicDistance = heuristic(startNode, finishNode);
	const unvisitedNodes = getAllNodes(grid);

	while (!!unvisitedNodes.length) {
		sortNodesByFScore(unvisitedNodes, finishNode);
		const closestNode = unvisitedNodes.shift();

		if (closestNode.isWall) continue;
		if (closestNode.distance === Infinity) return visitedNodesInOrder;

		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);

		if (closestNode === finishNode) return visitedNodesInOrder;

		updateUnvisitedNeighborsAStar(closestNode, grid, finishNode);
	}
}

function sortNodesByFScore(unvisitedNodes, finishNode) {
	unvisitedNodes.sort((nodeA, nodeB) => {
		const fScoreA = nodeA.distance + heuristic(nodeA, finishNode);
		const fScoreB = nodeB.distance + heuristic(nodeB, finishNode);
		return fScoreA - fScoreB;
	});
}

function updateUnvisitedNeighborsAStar(node, grid, finishNode) {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of unvisitedNeighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.heuristicDistance = heuristic(neighbor, finishNode);
		neighbor.previousNode = node;
	}
}
