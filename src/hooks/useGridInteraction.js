import { useCallback, useRef } from 'react';
import { getNewGridWithWallToggled } from '../utils/path-finding-utils';

// Bresenham's line algorithm to get all cells between two points
const getLineCells = (row0, col0, row1, col1) => {
	const cells = [];
	const dx = Math.abs(col1 - col0);
	const dy = Math.abs(row1 - row0);
	const sx = col0 < col1 ? 1 : -1;
	const sy = row0 < row1 ? 1 : -1;
	let err = dx - dy;

	let currentRow = row0;
	let currentCol = col0;

	while (true) {
		cells.push({ row: currentRow, col: currentCol });

		if (currentRow === row1 && currentCol === col1) break;

		const e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			currentCol += sx;
		}
		if (e2 < dx) {
			err += dx;
			currentRow += sy;
		}
	}

	return cells;
};

export const useGridInteraction = (state, setState, isPencil) => {
	const lastPositionRef = useRef(null);
	const processedCellsRef = useRef(new Set());

	const toggleMultipleCells = useCallback(
		(cells) => {
			if (state.isAnimating) return;

			let newGrid = state.grid;
			let hasChanges = false;

			for (const { row, col } of cells) {
				const cellKey = `${row}-${col}`;
				if (!processedCellsRef.current.has(cellKey)) {
					const updatedGrid = getNewGridWithWallToggled(
						newGrid,
						row,
						col,
						isPencil,
					);
					if (updatedGrid !== newGrid) {
						newGrid = updatedGrid;
						hasChanges = true;
					}
					processedCellsRef.current.add(cellKey);
				}
			}

			if (hasChanges) {
				setState((prevState) => ({ ...prevState, grid: newGrid }));
			}
		},
		[state.isAnimating, state.grid, isPencil, setState],
	);

	const handleMouseDown = useCallback(
		(row, col) => {
			processedCellsRef.current = new Set(); // Reset on mouse down
			lastPositionRef.current = { row, col };
			toggleMultipleCells([{ row, col }]);
			setState((prevState) => ({ ...prevState, mouseIsPressed: true }));
		},
		[toggleMultipleCells, setState],
	);

	const handleMouseEnter = useCallback(
		(row, col) => {
			if (!state.mouseIsPressed) return;

			const cells = [];

			// If we have a last position, interpolate between them
			if (lastPositionRef.current) {
				const { row: lastRow, col: lastCol } = lastPositionRef.current;
				if (lastRow !== row || lastCol !== col) {
					// Get all cells between last position and current position
					const lineCells = getLineCells(lastRow, lastCol, row, col);
					cells.push(...lineCells);
				}
			} else {
				cells.push({ row, col });
			}

			lastPositionRef.current = { row, col };
			toggleMultipleCells(cells);
		},
		[state.mouseIsPressed, toggleMultipleCells],
	);

	const handleMouseUp = useCallback(() => {
		lastPositionRef.current = null;
		processedCellsRef.current = new Set(); // Reset on mouse up
		setState((prevState) => ({ ...prevState, mouseIsPressed: false }));
	}, [setState]);

	return {
		handleMouseDown,
		handleMouseEnter,
		handleMouseUp,
	};
};
