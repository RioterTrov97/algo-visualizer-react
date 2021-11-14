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
}) => {
	const extraClassName = isFinish ? 'node-finish' : isStart ? 'node-start' : '';

	return (
		<div
			key={`node-${row}-${col}`}
			className={`${className} ${extraClassName}`}
			onMouseDown={() => onMouseDown(row, col)}
			onMouseOver={() => onMouseEnter(row, col)}
			onTouchStart={() => onMouseDown(row, col)}
			onTouchMove={() => onMouseEnter(row, col)}
			onMouseUp={onMouseUp}
			onTouchEnd={onMouseUp}
		/>
	);
};
