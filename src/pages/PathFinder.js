import React, { useEffect, useState } from 'react';
import { Node } from '../components/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../utils/dijkstra';
import {
	changeClassName,
	getInitialGrid,
	getNewGridWithWallToggled,
} from '../utils/path-finding-utils';
import '../styles/path-finder.css';
import {
	Slider,
	SliderTrack,
	SliderThumb,
	SliderFilledTrack,
	Button,
	Flex,
	Heading,
	Text,
	Alert,
	AlertIcon,
	IconButton,
	Icon,
	Center,
} from '@chakra-ui/react';
import { ImPencil2 } from 'react-icons/im';
import { FaEraser } from 'react-icons/fa';

const INITIAL_STATE = {
	grid: [],
	startNode: {},
	finishNode: {},
	animationSpeed: 10,
	mouseIsPressed: false,
	resetGraph: true,
	isAnimating: false,
	isInAnimationFinishedState: false,
};

const width =
	window.innerWidth ||
	document.documentElement.clientWidth ||
	document.body.clientWidth;
const height =
	window.innerHeight ||
	document.documentElement.clientHeight ||
	document.body.clientHeight;

const PathFindingVisualizer = () => {
	const [state, setState] = useState(INITIAL_STATE);
	const [isPencil, setIsPencil] = useState(true);
	const animationSpeed = 11 - state.animationSpeed;

	useEffect(() => {
		if (state.resetGraph) {
			const numRows = Math.floor(height / 65);
			const numColumns = Math.floor(width / 42);

			const [grid, startNode, finishNode] = getInitialGrid(numRows, numColumns);
			setState((prevState) => ({
				...prevState,
				grid,
				startNode,
				finishNode,
				resetGraph: false,
			}));
		}
	}, [state.resetGraph]);

	const handleUpdateStateWithWalls = (row, col, mouseIsPressed) => {
		const newGrid = getNewGridWithWallToggled(state.grid, row, col, isPencil);
		setState((prevState) => ({ ...prevState, grid: newGrid, mouseIsPressed }));
	};

	const handleMouseDown = (row, col) => {
		handleUpdateStateWithWalls(row, col, true);
	};

	const handleMouseEnter = (row, col) => {
		if (!state.mouseIsPressed) return;
		handleUpdateStateWithWalls(row, col, true);
	};

	const handleMouseUp = () => {
		setState((prevState) => ({ ...prevState, mouseIsPressed: false }));
	};

	const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
		setState((prevState) => ({ ...prevState, isAnimating: true }));
		for (let i = 0; i <= visitedNodesInOrder.length; i++) {
			if (i === visitedNodesInOrder.length) {
				setTimeout(() => {
					animateShortestPath(nodesInShortestPathOrder);
				}, 10 * animationSpeed * i);
				return;
			}
			setTimeout(() => {
				const node = visitedNodesInOrder[i];
				const newClassName = node.className + ' node-visited';
				const newGrid = changeClassName(
					state.grid,
					node.row,
					node.col,
					newClassName
				);
				setState((prevState) => ({ ...prevState, grid: newGrid }));
				if (i === visitedNodesInOrder.length - 1) {
					setState((prevState) => ({
						...prevState,
						isAnimating: false,
						isInAnimationFinishedState: true,
					}));
				}
			}, 10 * animationSpeed * i);
		}
	};

	const animateShortestPath = (nodesInShortestPathOrder) => {
		for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
			setTimeout(() => {
				const node = nodesInShortestPathOrder[i];
				const newClassName = node.className + ' node-shortest-path';
				const newGrid = changeClassName(
					state.grid,
					node.row,
					node.col,
					newClassName
				);
				setState((prevState) => ({ ...prevState, grid: newGrid }));
			}, 20 * animationSpeed * i);
		}
	};

	const visualizeDijkstra = () => {
		const grid = state.grid;
		const startNode = grid[state.startNode[0]][state.startNode[1]];
		const finishNode = grid[state.finishNode[0]][state.finishNode[1]];
		const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
		const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
		animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
	};

	const handleVisualizeDijkstraAlgorithm = () => {
		if (!state.isAnimating) {
			if (state.isInAnimationFinishedState) {
				setState(INITIAL_STATE);
				visualizeDijkstra();
				return;
			}
			visualizeDijkstra();
		}
	};

	return (
		<Flex direction="column">
			<Heading mx="auto" mt={10} size="lg">
				This is Dijsktra Algorithm Visualizer
			</Heading>
			<Flex
				my={5}
				mx="auto"
				direction={['column', 'row']}
				alignItems={['center']}>
				<Flex mx="auto" mb={5}>
					<Button
						colorScheme="teal"
						disabled={state.isAnimating || state.isInAnimationFinishedState}
						onClick={handleVisualizeDijkstraAlgorithm}
						mx={5}>
						Visualize Dijkstra's Algorithm
					</Button>
					<Button
						colorScheme="red"
						mx={5}
						disabled={state.isAnimating}
						onClick={() => setState(INITIAL_STATE)}>
						Reset board
					</Button>
				</Flex>
				<Center>
					<Flex
						background="blue.50"
						px={4}
						py={3}
						ml={5}
						rounded={5}
						direction="column"
						w="max-content">
						<Heading as="h4" size="sm" mr={5}>
							Set Animation Speed
						</Heading>
						<Flex mt={3}>
							<Slider
								maxWidth={'140px'}
								aria-label="slider"
								min={1}
								max={10}
								defaultValue={state.animationSpeed}
								onChange={(value) =>
									setState((prevState) => ({
										...prevState,
										animationSpeed: value,
									}))
								}>
								<SliderTrack bg="blue.100">
									<SliderFilledTrack bg="cyan.400" />
								</SliderTrack>
								<SliderThumb bg="cyan.600" />
							</Slider>
							<Text ml={2} fontWeight="bold" color="cyan.700">
								{state.animationSpeed}
							</Text>
						</Flex>
					</Flex>
					<Flex
						background="blue.50"
						px={4}
						py={2}
						ml={5}
						rounded={5}
						direction="column"
						w="max-content">
						<Heading as="h4" size="sm">
							Pencil/Eraser
						</Heading>
						<Flex mx="auto" mt={2}>
							<IconButton
								colorScheme={isPencil ? 'cyan' : 'gray'}
								onClick={() => setIsPencil(true)}
								aria-label="Search database"
								icon={<Icon as={ImPencil2} />}
								mr={5}
							/>
							<IconButton
								colorScheme={!isPencil ? 'cyan' : 'gray'}
								onClick={() => setIsPencil(false)}
								aria-label="Search database"
								icon={<Icon as={FaEraser} />}
							/>
						</Flex>
					</Flex>
				</Center>
			</Flex>

			<Flex mx="auto" mb={5} w="max-content">
				<Alert
					rounded={5}
					status={
						!state.isAnimating && !state.isInAnimationFinishedState
							? 'info'
							: 'warning'
					}>
					<AlertIcon />
					{!state.isAnimating && !state.isInAnimationFinishedState
						? 'Draw some walls using pencil and Click on visualize Dijkstra Algorith to begin'
						: state.isAnimating && !state.isInAnimationFinishedState
						? 'Please wait for the algorithm to finish'
						: 'Please reset board to view again'}
				</Alert>
			</Flex>

			<Flex direction="column" mx="auto">
				{state.grid.map((row, rowIdx) => {
					return (
						<div
							key={rowIdx}
							className={`grid-row ${
								state.mouseIsPressed || !state.isInAnimationFinishedState
									? 'grid-pen'
									: ''
							}`}>
							{row.map((node, nodeIdx) => {
								const { row, col, isFinish, isStart, className } = node;
								return (
									<Node
										key={nodeIdx}
										col={col}
										row={row}
										className={className}
										isFinish={isFinish}
										isStart={isStart}
										onMouseDown={handleMouseDown}
										onMouseEnter={handleMouseEnter}
										onMouseUp={handleMouseUp}
									/>
								);
							})}
						</div>
					);
				})}
			</Flex>
			<Flex mx="auto" direction="column" my={5} py={3}>
				<Heading size="lg" mb={5} mx="auto">
					Legends
				</Heading>
				<Flex wrap="wrap">
					<LegendItem title="Unvisited Node" className="node" />
					<LegendItem title="Visited Node" className="node node-visited" />
					<LegendItem title="Wall" className="node node-wall" />
					<LegendItem
						title="Shortest Path"
						className="node node-shortest-path"
					/>
					<LegendItem title="Start Node" className="node node-start" />
					<LegendItem title="Finish Node" className="node node-finish" />
				</Flex>
			</Flex>
		</Flex>
	);
};

export default PathFindingVisualizer;

const LegendItem = ({ title, className }) => {
	return (
		<Flex mx={2} direction="column" alignItems="center">
			<Text>{title}</Text>
			<Flex className={className}></Flex>
		</Flex>
	);
};
