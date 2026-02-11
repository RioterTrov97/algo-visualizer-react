import React from 'react';
import '../styles/node.css';

export const Node = ({
	col,
	className,
	isFinish,
	isStart,
	onMouseDown,
	onMouseEnter,
	onMouseUp,
	row,
	direction,
}) => {
	const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : '';

	const handlePointerDown = (e) => {
		e.preventDefault();
		onMouseDown(row, col);
	};

	const handlePointerEnter = (e) => {
		onMouseEnter(row, col);
	};

	return (
		<div
			key={`node-${row}-${col}`}
			className={`${className} ${extraClassName}`}
			data-direction={direction}
			data-row={row}
			data-col={col}
			onPointerDown={handlePointerDown}
			onPointerEnter={handlePointerEnter}
			onPointerUp={onMouseUp}
			style={{ touchAction: 'none' }}
		/>
	);
};
