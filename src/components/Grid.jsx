import React from 'react';
import { Node } from '../components/Node';
import { Flex } from '@chakra-ui/react';

export const Grid = ({
	grid,
	isAnimating,
	isPencil,
	onMouseDown,
	onMouseEnter,
	onMouseUp,
}) => {
	return (
		<Flex direction="column" mx="auto">
			{grid.map((row, rowIdx) => {
				return (
					<div
						key={rowIdx}
						className={`grid-row ${
							isAnimating
								? 'grid-progress'
								: isPencil
									? 'grid-pencil'
									: 'grid-eraser'
						}`}>
						{row.map((node, nodeIdx) => {
							const { row, col, isFinish, isStart, className, direction } =
								node;
							return (
								<Node
									key={nodeIdx}
									col={col}
									row={row}
									className={className}
									isFinish={isFinish}
									isStart={isStart}
									direction={direction}
									onMouseDown={onMouseDown}
									onMouseEnter={onMouseEnter}
									onMouseUp={onMouseUp}
								/>
							);
						})}
					</div>
				);
			})}
		</Flex>
	);
};
