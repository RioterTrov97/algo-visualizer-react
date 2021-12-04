import React, { useEffect, useRef, useState } from 'react';
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
	Select,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	useBreakpointValue,
} from '@chakra-ui/react';
import { ImPencil2 } from 'react-icons/im';
import { FaEraser } from 'react-icons/fa';
import { recursiveDivisionMaze } from '../utils/maze-generation/recursive-division';
import { eller } from '../utils/maze-generation/ellers';

const getInitialState = () => {
	const width =
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth;
	const height =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

	let numRows = Math.floor(height / 50);
	let numColumns = Math.floor(width / 35);

	if (numRows % 2 === 0) numRows++;
	if (numColumns % 2 === 0) numColumns++;

	const [grid, startNode, finishNode] = getInitialGrid(numRows, numColumns);

	return {
		grid,
		startNode,
		finishNode,
		animationSpeed: 10,
		mouseIsPressed: false,
		resetGraph: false,
		resetGraphType: null,
		isAnimating: false,
		isPathAnimationFinished: false,
		isMazeAnimationFinished: false,
		usedPathAlgo: 'djikstra',
		usedMazeAlgo: '',
		numRows,
		numColumns,
	};
};

const PathFindingVisualizer = () => {
	const [state, setState] = useState(getInitialState());
	const [isPencil, setIsPencil] = useState(true);
	const [accord, setAccord] = useState(0);
	const resetAndAnimateType = useRef(null);
	const animationSpeed = (11 - state.animationSpeed) * 20;
	const isMobile = useBreakpointValue({
		base: true,
		md: true,
		lg: false,
	});
	const viewportWidth = useBreakpointValue({
		base: 0,
		md: 1,
		lg: 2,
		xl: 3,
	});

	useEffect(() => {
		setState({ ...getInitialState() });

		setAccord(isMobile ? 1 : 0);

		//eslint-disable-next-line
	}, [viewportWidth]);

	useEffect(() => {
		if (state.resetGraph) {
			if (resetAndAnimateType.current === 'djikstra') {
				handleDijkstraAlgo();
			} else if (resetAndAnimateType.current === 'recursive-maze') {
				handleRecursiveMazeAlgo();
			}
			setState((prevState) => ({ ...prevState, resetGraph: false }));
		}

		//eslint-disable-next-line
	}, [state.resetGraph]);

	const handleUpdateStateWithWalls = (row, col, mouseIsPressed) => {
		if (state.isAnimating) return;
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
				}, animationSpeed * i);
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
						isPathAnimationFinished: true,
					}));
				}
			}, animationSpeed * i);
		}
		resetAndAnimateType.current = null;
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
			}, animationSpeed * i);
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

	const handleDijkstraAlgo = () => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				resetAndAnimateType.current = 'djikstra';
				setState({ ...getInitialState(), resetGraph: true });
			} else {
				visualizeDijkstra();
			}
		}
	};

	const handleEllerAlgo = () => {
		const wallsToAnimate = eller(state.grid);
		for (let i = 0; i < wallsToAnimate.length; i++) {
			setTimeout(() => {
				const wallNode = wallsToAnimate[i];
				const newGrid = getNewGridWithWallToggled(
					state.grid,
					wallNode.row,
					wallNode.col,
					true
				);
				const isLastAnimation = i === wallsToAnimate.length - 1;
				setState((prevState) => ({
					...prevState,
					grid: newGrid,
					isMazeAnimationFinished: isLastAnimation,
					isAnimating: !isLastAnimation,
				}));
			}, animationSpeed * i);
		}
		resetAndAnimateType.current = null;
	};

	const handleRecursiveMazeAlgo = (orientation = 'horizontal') => {
		if (state.isPathAnimationFinished || state.isMazeAnimationFinished) {
			resetAndAnimateType.current = 'recursive-maze';
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}
		const wallsToAnimate = recursiveDivisionMaze(
			state.grid,
			2,
			state.grid.length - 3,
			2,
			state.grid[0].length - 3,
			false,
			[],
			orientation
		);

		for (let i = 0; i < wallsToAnimate.length; i++) {
			setTimeout(() => {
				const wallNode = wallsToAnimate[i];
				const newGrid = getNewGridWithWallToggled(
					state.grid,
					wallNode.row,
					wallNode.col,
					true
				);
				const isLastAnimation = i === wallsToAnimate.length - 1;
				setState((prevState) => ({
					...prevState,
					grid: newGrid,
					isMazeAnimationFinished: isLastAnimation,
					isAnimating: !isLastAnimation,
				}));
			}, animationSpeed * i);
		}
		resetAndAnimateType.current = null;
	};

	const handleAnimatePathAlgoChange = () => {
		const algo = state.usedPathAlgo;

		if (algo === 'djikstra') {
			handleDijkstraAlgo();
		}
	};

	const handleAnimateMazeAlgoChange = (e) => {
		const algo = e.target.value;
		if (!algo) return;

		setState((prevState) => ({ ...prevState, usedMazeAlgo: algo }));
		if (algo === 'recursive-horizontal') {
			handleRecursiveMazeAlgo('horizontal');
		} else if (algo === 'recursive-vertical') {
			handleRecursiveMazeAlgo('vertical');
		} else if (algo === 'eller') {
			handleEllerAlgo();
		}
	};

	return (
		<Flex direction="column" justify="center" w={'100%'}>
			<Center
				className={!isMobile ? 'logo' : 'logo-mobile'}
				zIndex={99999}
				my={isMobile && 3}>
				<Heading as="h2" size={!isMobile ? 'md' : 'lg'} mb={2}>
					Algo Visualizer
				</Heading>
			</Center>
			{!isMobile && <Text className="emoji-animation">🕵️</Text>}
			<Accordion
				index={accord}
				allowToggle={isMobile ? true : false}
				onChange={(e) => setAccord(e)}>
				<AccordionItem isFocusable={false} border="0px">
					<Center>
						<AccordionButton
							w="max-content"
							variant="ghost"
							_focus={{ boxShadow: 'none' }}
							_hover={{ bg: 'blue.200' }}
							mb={isMobile ? 5 : 0}
							bg={isMobile && 'blue.100'}
							rounded={50}>
							{isMobile && (
								<Center flex="1" textAlign="left">
									<Text fontWeight="600">Algo Tuners (Click me)</Text>
									<Text className="gear" ml={2}>
										⚙️
									</Text>
								</Center>
							)}
						</AccordionButton>
					</Center>
					<AccordionPanel pb={4}>
						<Flex
							my={[2, 2, 5]}
							mx="auto"
							wrap={'wrap'}
							justify="center"
							align="center">
							<Flex
								direction="column"
								background="blue.50"
								px={4}
								py={3}
								ml={5}
								mb={[2, 2, 0]}
								rounded={5}
								disabled={state.isAnimating}>
								<Heading as="h4" size="sm" mb={2}>
									Select Path Algo
								</Heading>
								<Select
									placeholder="Choose path algo"
									bg="white"
									value={state.usedPathAlgo}
									onChange={(e) => {
										if (!e.target.value) return;
										setState((prevState) => ({
											...prevState,
											usedPathAlgo: e.target.value,
										}));
									}}
									isDisabled={state.isAnimating}>
									<option value="djikstra">Djikstra</option>
								</Select>
							</Flex>
							<Flex
								direction="column"
								background="blue.50"
								px={4}
								py={3}
								ml={5}
								mb={[2, 2, 0]}
								rounded={5}>
								<Heading as="h4" size="sm" mb={2}>
									Select Maze Algo
								</Heading>
								<Select
									bg="white"
									value={state.usedMazeAlgo}
									onChange={handleAnimateMazeAlgoChange}
									isDisabled={state.isAnimating}>
									<option value=" ">Choose maze algo</option>
									<option value="recursive-horizontal">
										Recursive (horizontal)
									</option>
									<option value="recursive-vertical">
										Recursive (vertical)
									</option>
									<option value="eller">Eller</option>
								</Select>
							</Flex>
							<Center wrap="wrap" maxWidth="90vw">
								<Flex
									ml={[0, 4]}
									background="blue.50"
									py={4}
									px={5}
									rounded={5}
									direction="column"
									w="max-content">
									<Heading as="h4" size="sm" mr={[2, 5]}>
										Animation Speed
									</Heading>
									<Flex mt={3}>
										<Slider
											isReadOnly={state.isAnimating}
											isDisabled={state.isAnimating}
											maxWidth={['100px', '140px']}
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
										<Text ml={4} fontWeight="bold" color="cyan.700">
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

						<Flex justify="center" wrap="wrap" mx="auto">
							<LegendItem title="Unvisited" className="node" />
							<LegendItem title="Visited" className="node node-visited" />
							<LegendItem title="Wall" className="node node-wall" />
							<LegendItem
								title="ShortPath"
								className="node node-shortest-path"
							/>
							<LegendItem title="Start" className="node node-start" />
							<LegendItem title="Finish" className="node node-finish" />
						</Flex>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Flex
				mx="auto"
				mb={[2, 2, 5]}
				wrap="wrap"
				maxWidth="90vw"
				justify="center"
				align="center">
				<Button
					colorScheme="teal"
					loadingText="Animating..."
					isLoading={state.isAnimating || !state.usedPathAlgo}
					onClick={handleAnimatePathAlgoChange}
					mr={5}>
					Visualize!
				</Button>
				<Button
					colorScheme="red"
					disabled={state.isAnimating}
					onClick={() => setState({ ...getInitialState() })}
					mr={5}>
					Reset board
				</Button>
				<Alert
					width="max-content"
					rounded={5}
					py={2}
					mt={[2, 2, 0]}
					status={!state.isAnimating ? 'info' : 'warning'}>
					<AlertIcon />
					{!state.isAnimating
						? 'Draw walls using pencil or chose algo and click Visualize!'
						: 'Please wait for the algorithm animation to finish!'}
				</Alert>
			</Flex>
			<Flex direction="column" mx="auto">
				{state.grid.map((row, rowIdx) => {
					return (
						<div
							key={rowIdx}
							className={`grid-row ${
								state.isAnimating
									? 'grid-progress'
									: isPencil
									? 'grid-pencil'
									: 'grid-eraser'
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
		</Flex>
	);
};

export default PathFindingVisualizer;

const LegendItem = ({ title, className }) => {
	return (
		<Flex
			mx={2}
			p={2}
			rounded={5}
			border="1px solid"
			borderColor="blue.200"
			mb={2}
			direction="column"
			alignItems="center">
			<Text>{title}</Text>
			<Flex className={className}></Flex>
		</Flex>
	);
};
