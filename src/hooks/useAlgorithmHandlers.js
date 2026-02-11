import { recursiveDivisionMaze } from '../utils/maze-generation/recursive-division';
import { eller } from '../utils/maze-generation/ellers';
import { prims } from '../utils/maze-generation/prims';
import { kruskals } from '../utils/maze-generation/kruskals';
import { sidewinder } from '../utils/maze-generation/sidewinder';
import { resetGridForNewPathfinding } from '../utils/path-finding-utils';

const PATH_ALGORITHMS = {
	djikstra: 'djikstra',
	astar: 'astar',
	bfs: 'bfs',
	greedy: 'greedy',
};

const MAZE_ALGORITHMS = {
	eller: 'eller',
	prims: 'prims',
	kruskals: 'kruskals',
	sidewinder: 'sidewinder',
	'recursive-maze': 'recursive-maze',
};

export const useAlgorithmHandlers = (
	state,
	setState,
	animateWalls,
	visualizeDijkstra,
	visualizeAStar,
	visualizeBFS,
	visualizeGreedyBestFirst,
	resetAndAnimateType,
	getInitialState,
) => {
	// Generic path algorithm handler
	const handlePathAlgo = (algoType, visualizeFunc) => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				const resetGrid = resetGridForNewPathfinding(state.grid);
				setState((prevState) => ({
					...prevState,
					grid: resetGrid,
					isPathAnimationFinished: false,
				}));
				resetAndAnimateType.current = algoType;
				setState((prevState) => ({ ...prevState, resetGraph: true }));
			} else {
				visualizeFunc();
			}
		}
	};

	// Generic maze algorithm handler
	const handleMazeAlgo = (algoType, mazeFunc, ...args) => {
		if (state.isPathAnimationFinished || state.isMazeAnimationFinished) {
			resetAndAnimateType.current = algoType;
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}

		const wallsToAnimate = mazeFunc(state.grid, ...args);
		setState((prevState) => ({
			...prevState,
			isAnimating: true,
			isPathAnimationFinished: false,
		}));
		animateWalls(wallsToAnimate, () => {
			setState((prevState) => ({
				...prevState,
				isMazeAnimationFinished: true,
				isAnimating: false,
			}));
		});
		resetAndAnimateType.current = null;
	};

	// Path algorithm handlers
	const handleDijkstraAlgo = () =>
		handlePathAlgo(PATH_ALGORITHMS.djikstra, visualizeDijkstra);
	const handleAStarAlgo = () =>
		handlePathAlgo(PATH_ALGORITHMS.astar, visualizeAStar);
	const handleBFSAlgo = () => handlePathAlgo(PATH_ALGORITHMS.bfs, visualizeBFS);
	const handleGreedyBestFirstAlgo = () =>
		handlePathAlgo(PATH_ALGORITHMS.greedy, visualizeGreedyBestFirst);

	// Maze algorithm handlers
	const handleEllerAlgo = () => handleMazeAlgo(MAZE_ALGORITHMS.eller, eller);
	const handlePrimsAlgo = () => handleMazeAlgo(MAZE_ALGORITHMS.prims, prims);
	const handleKruskalsAlgo = () =>
		handleMazeAlgo(MAZE_ALGORITHMS.kruskals, kruskals);
	const handleSidewinderAlgo = () =>
		handleMazeAlgo(MAZE_ALGORITHMS.sidewinder, sidewinder);

	const handleRecursiveMazeAlgo = (orientation = 'horizontal') => {
		handleMazeAlgo(
			MAZE_ALGORITHMS['recursive-maze'],
			recursiveDivisionMaze,
			2,
			state.grid.length - 3,
			2,
			state.grid[0].length - 3,
			false,
			[],
			orientation,
		);
	};

	const handleAnimatePathAlgoChange = (e) => {
		const algo = e.target.value;
		if (!algo) return;

		const handlers = {
			[PATH_ALGORITHMS.djikstra]: handleDijkstraAlgo,
			[PATH_ALGORITHMS.astar]: handleAStarAlgo,
			[PATH_ALGORITHMS.bfs]: handleBFSAlgo,
			[PATH_ALGORITHMS.greedy]: handleGreedyBestFirstAlgo,
		};

		const handler = handlers[algo];
		if (handler) handler();

		setState((prevState) => ({ ...prevState, usedPathAlgo: algo }));
	};

	const handleAnimateMazeAlgoChange = (e) => {
		const algo = e.target.value;
		if (!algo) return;

		const handlers = {
			'recursive-horizontal': () => handleRecursiveMazeAlgo('horizontal'),
			'recursive-vertical': () => handleRecursiveMazeAlgo('vertical'),
			[MAZE_ALGORITHMS.eller]: handleEllerAlgo,
			[MAZE_ALGORITHMS.prims]: handlePrimsAlgo,
			[MAZE_ALGORITHMS.kruskals]: handleKruskalsAlgo,
			[MAZE_ALGORITHMS.sidewinder]: handleSidewinderAlgo,
		};

		const handler = handlers[algo];
		if (handler) handler();

		setState((prevState) => ({ ...prevState, usedMazeAlgo: algo }));
	};

	return {
		handleDijkstraAlgo,
		handleAStarAlgo,
		handleBFSAlgo,
		handleGreedyBestFirstAlgo,
		handleEllerAlgo,
		handleRecursiveMazeAlgo,
		handlePrimsAlgo,
		handleKruskalsAlgo,
		handleSidewinderAlgo,
		handleAnimatePathAlgoChange,
		handleAnimateMazeAlgoChange,
	};
};
