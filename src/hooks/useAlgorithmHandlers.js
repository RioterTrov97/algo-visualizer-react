import { recursiveDivisionMaze } from '../utils/maze-generation/recursive-division';
import { eller } from '../utils/maze-generation/ellers';
import { prims } from '../utils/maze-generation/prims';
import { kruskals } from '../utils/maze-generation/kruskals';
import { sidewinder } from '../utils/maze-generation/sidewinder';
import { resetGridForNewPathfinding } from '../utils/path-finding-utils';

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
	const handleDijkstraAlgo = () => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				// Reset visited nodes while preserving walls
				const resetGrid = resetGridForNewPathfinding(state.grid);
				setState((prevState) => ({
					...prevState,
					grid: resetGrid,
					isPathAnimationFinished: false,
				}));
				resetAndAnimateType.current = 'djikstra';
				setState((prevState) => ({ ...prevState, resetGraph: true }));
			} else {
				visualizeDijkstra();
			}
		}
	};

	const handleAStarAlgo = () => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				// Reset visited nodes while preserving walls
				const resetGrid = resetGridForNewPathfinding(state.grid);
				setState((prevState) => ({
					...prevState,
					grid: resetGrid,
					isPathAnimationFinished: false,
				}));
				resetAndAnimateType.current = 'astar';
				setState((prevState) => ({ ...prevState, resetGraph: true }));
			} else {
				visualizeAStar();
			}
		}
	};

	const handleBFSAlgo = () => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				// Reset visited nodes while preserving walls
				const resetGrid = resetGridForNewPathfinding(state.grid);
				setState((prevState) => ({
					...prevState,
					grid: resetGrid,
					isPathAnimationFinished: false,
				}));
				resetAndAnimateType.current = 'bfs';
				setState((prevState) => ({ ...prevState, resetGraph: true }));
			} else {
				visualizeBFS();
			}
		}
	};

	const handleGreedyBestFirstAlgo = () => {
		if (!state.isAnimating) {
			if (state.isPathAnimationFinished) {
				// Reset visited nodes while preserving walls
				const resetGrid = resetGridForNewPathfinding(state.grid);
				setState((prevState) => ({
					...prevState,
					grid: resetGrid,
					isPathAnimationFinished: false,
				}));
				resetAndAnimateType.current = 'greedy';
				setState((prevState) => ({ ...prevState, resetGraph: true }));
			} else {
				visualizeGreedyBestFirst();
			}
		}
	};

	const handleEllerAlgo = () => {
		if (state.isMazeAnimationFinished) {
			resetAndAnimateType.current = 'eller';
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}
		const wallsToAnimate = eller(state.grid);
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
			orientation,
		);

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

	const handlePrimsAlgo = () => {
		if (state.isMazeAnimationFinished) {
			resetAndAnimateType.current = 'prims';
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}
		const wallsToAnimate = prims(state.grid);
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

	const handleKruskalsAlgo = () => {
		if (state.isMazeAnimationFinished) {
			resetAndAnimateType.current = 'kruskals';
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}
		const wallsToAnimate = kruskals(state.grid);
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

	const handleSidewinderAlgo = () => {
		if (state.isMazeAnimationFinished) {
			resetAndAnimateType.current = 'sidewinder';
			setState({ ...getInitialState(), resetGraph: true, isAnimating: true });
			return;
		}
		const wallsToAnimate = sidewinder(state.grid);
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

	const handleAnimatePathAlgoChange = () => {
		const algo = state.usedPathAlgo;

		if (algo === 'djikstra') {
			handleDijkstraAlgo();
		} else if (algo === 'astar') {
			handleAStarAlgo();
		} else if (algo === 'bfs') {
			handleBFSAlgo();
		} else if (algo === 'greedy') {
			handleGreedyBestFirstAlgo();
		}
	};

	const handleAnimateMazeAlgoChange = (e) => {
		const algo = e.target.value;
		if (!algo) return;

		if (algo === 'recursive-horizontal') {
			handleRecursiveMazeAlgo('horizontal');
		} else if (algo === 'recursive-vertical') {
			handleRecursiveMazeAlgo('vertical');
		} else if (algo === 'eller') {
			handleEllerAlgo();
		} else if (algo === 'prims') {
			handlePrimsAlgo();
		} else if (algo === 'kruskals') {
			handleKruskalsAlgo();
		} else if (algo === 'sidewinder') {
			handleSidewinderAlgo();
		}

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
