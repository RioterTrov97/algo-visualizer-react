import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { getInitialGrid } from '../utils/path-finding-utils';
import '../styles/path-finder.css';

import { Header } from '../components/Header';
import { ControlPanel } from '../components/ControlPanel';
import { ActionBar } from '../components/ActionBar';
import { Grid } from '../components/Grid';

import { useAnimationEngine } from '../hooks/useAnimationEngine';
import { useAlgorithmHandlers } from '../hooks/useAlgorithmHandlers';
import { useGridInteraction } from '../hooks/useGridInteraction';
import { LegendItem } from '../components/LegendItem';

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
	const animationSpeed = useMemo(
		() => (11 - state.animationSpeed) * 10,
		[state.animationSpeed],
	);
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

	// Initialize animation engine, algorithm handlers, and grid interaction
	const animationEngine = useAnimationEngine(
		state,
		setState,
		animationSpeed,
		resetAndAnimateType,
	);

	const algorithmHandlers = useAlgorithmHandlers(
		state,
		setState,
		animationEngine.animateWalls,
		animationEngine.visualizeDijkstra,
		animationEngine.visualizeAStar,
		animationEngine.visualizeBFS,
		animationEngine.visualizeGreedyBestFirst,
		resetAndAnimateType,
		getInitialState,
	);

	const gridInteraction = useGridInteraction(state, setState, isPencil);

	useEffect(() => {
		setState({ ...getInitialState() });
		setAccord(isMobile ? 1 : 0);
		//eslint-disable-next-line
	}, [viewportWidth]);

	useEffect(() => {
		if (state.resetGraph) {
			if (resetAndAnimateType.current === 'djikstra') {
				algorithmHandlers.handleDijkstraAlgo();
			} else if (resetAndAnimateType.current === 'astar') {
				algorithmHandlers.handleAStarAlgo();
			} else if (resetAndAnimateType.current === 'bfs') {
				algorithmHandlers.handleBFSAlgo();
			} else if (resetAndAnimateType.current === 'greedy') {
				algorithmHandlers.handleGreedyBestFirstAlgo();
			} else if (resetAndAnimateType.current === 'recursive-maze') {
				algorithmHandlers.handleRecursiveMazeAlgo();
			} else if (resetAndAnimateType.current === 'eller') {
				algorithmHandlers.handleEllerAlgo();
			} else if (resetAndAnimateType.current === 'prims') {
				algorithmHandlers.handlePrimsAlgo();
			} else if (resetAndAnimateType.current === 'kruskals') {
				algorithmHandlers.handleKruskalsAlgo();
			} else if (resetAndAnimateType.current === 'sidewinder') {
				algorithmHandlers.handleSidewinderAlgo();
			}
			setState((prevState) => ({ ...prevState, resetGraph: false }));
		}

		//eslint-disable-next-line
	}, [state.resetGraph]);

	return (
		<Flex direction="column" justify="center" w={'100%'}>
			<Header isMobile={isMobile} />
			<ControlPanel
				isMobile={isMobile}
				isAnimating={state.isAnimating}
				animationSpeed={state.animationSpeed}
				onAnimationSpeedChange={(value) =>
					setState((prevState) => ({
						...prevState,
						animationSpeed: value,
					}))
				}
				usedPathAlgo={state.usedPathAlgo}
				onPathAlgoChange={(e) => {
					if (!e.target.value) return;
					setState((prevState) => ({
						...prevState,
						usedPathAlgo: e.target.value,
					}));
				}}
				usedMazeAlgo={state.usedMazeAlgo}
				onMazeAlgoChange={algorithmHandlers.handleAnimateMazeAlgoChange}
				isPencil={isPencil}
				onPencilChange={setIsPencil}
				accordionIndex={accord}
				onAccordionChange={setAccord}
			/>
			<ActionBar
				isAnimating={state.isAnimating}
				usedPathAlgo={state.usedPathAlgo}
				onVisualize={algorithmHandlers.handleAnimatePathAlgoChange}
				onReset={() => setState({ ...getInitialState() })}
			/>
			<Grid
				grid={state.grid}
				isAnimating={state.isAnimating}
				isPencil={isPencil}
				onMouseDown={gridInteraction.handleMouseDown}
				onMouseEnter={gridInteraction.handleMouseEnter}
				onMouseUp={gridInteraction.handleMouseUp}
			/>
			<Flex justify="center" wrap="wrap" mx="auto" mt={8}>
				<LegendItem title="Unvisited" className="node" />
				<LegendItem title="Visited" className="node node-visited" />
				<LegendItem title="Wall" className="node node-wall" />
				<LegendItem title="ShortPath" className="node node-shortest-path" />
				<LegendItem title="Start" className="node node-start" />
				<LegendItem title="Finish" className="node node-finish" />
			</Flex>
		</Flex>
	);
};

export default PathFindingVisualizer;
