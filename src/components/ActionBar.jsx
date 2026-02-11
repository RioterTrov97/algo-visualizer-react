import React from 'react';
import { Button, Flex, Alert, AlertIcon, Center } from '@chakra-ui/react';

export const ActionBar = ({
	isAnimating,
	usedPathAlgo,
	onVisualize,
	onReset,
}) => {
	return (
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
				isLoading={isAnimating || !usedPathAlgo}
				onClick={onVisualize}
				mr={5}>
				Visualize!
			</Button>
			<Button colorScheme="red" disabled={isAnimating} onClick={onReset} mr={5}>
				Reset board
			</Button>
			<Alert
				width="max-content"
				rounded={5}
				py={2}
				mt={[2, 2, 0]}
				status={!isAnimating ? 'info' : 'warning'}>
				<AlertIcon />
				{!isAnimating
					? 'Draw walls using pencil or chose algo and click Visualize!'
					: 'Please wait for the algorithm animation to finish!'}
			</Alert>
		</Flex>
	);
};
