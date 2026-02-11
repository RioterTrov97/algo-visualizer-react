import React from 'react';
import { Center, Heading, Text } from '@chakra-ui/react';

export const Header = ({ isMobile }) => {
	return (
		<>
			<Center
				className={!isMobile ? 'logo' : 'logo-mobile'}
				zIndex={99999}
				my={isMobile && 3}>
				<Heading as="h2" size={!isMobile ? 'md' : 'lg'} mb={2}>
					Algo Visualizer
				</Heading>
			</Center>
			{!isMobile && <Text className="emoji-animation">🕵️</Text>}
		</>
	);
};
