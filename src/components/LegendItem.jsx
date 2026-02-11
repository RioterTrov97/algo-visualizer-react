import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

export const LegendItem = ({ title, className }) => {
	return (
		<Flex
			mx={2}
			p={2}
			rounded={5}
			border="1px solid"
			borderColor="blue.200"
			mb={2}
			direction="row"
			alignItems="center">
			<Text>{title}</Text>
			<Flex className={className} ml={2} borderRadius={4}></Flex>
		</Flex>
	);
};
