import React from 'react';
import {
	Slider,
	SliderTrack,
	SliderThumb,
	SliderFilledTrack,
	Flex,
	Heading,
	Text,
	Select,
	IconButton,
	Icon,
	Center,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	Button,
} from '@chakra-ui/react';
import { ImPencil2 } from 'react-icons/im';
import { FaEraser } from 'react-icons/fa';

export const ControlPanel = ({
	isMobile,
	isAnimating,
	animationSpeed,
	onAnimationSpeedChange,
	usedPathAlgo,
	onPathAlgoChange,
	usedMazeAlgo,
	onMazeAlgoChange,
	isPencil,
	onPencilChange,
	accordionIndex,
	onAccordionChange,
	onReset,
}) => {
	return (
		<Accordion
			index={accordionIndex}
			allowToggle={isMobile ? true : false}
			mb={isMobile ? 2 : 0}
			onChange={onAccordionChange}>
			<AccordionItem isFocusable={false} border="0px">
				<Center>
					<AccordionButton
						w="max-content"
						variant="ghost"
						_focus={{ boxShadow: 'none' }}
						_hover={{ bg: 'blue.200' }}
						bg={isMobile && 'blue.100'}
						rounded={50}>
						{isMobile && (
							<Center flex="1" textAlign="left">
								<Text fontWeight="600">Algo Tuners (Click me)</Text>
								<Text className="gear" ml={2}>
									⚙️
								</Text>
							</Center>
						)}
					</AccordionButton>
				</Center>
				<AccordionPanel pb={0}>
					<Flex
						py={isMobile ? 2 : 5}
						mx="auto"
						wrap={'wrap'}
						justify={isMobile ? 'flex-start' : 'center'}
						align="center"
						borderWidth={isMobile ? 2 : 0}
						borderRadius={10}>
						<Flex
							direction="column"
							background="blue.50"
							px={4}
							py={3}
							ml={5}
							mb={isMobile ? 2 : 0}
							rounded={5}
							disabled={isAnimating}>
							<Heading as="h4" size="sm" mb={2}>
								Visualise Path Finding
							</Heading>
							<Select
								placeholder="Choose path algo"
								bg="white"
								value={usedPathAlgo}
								onChange={onPathAlgoChange}
								isDisabled={isAnimating}>
								<option value="djikstra">Dijkstra</option>
								<option value="astar">A* (A-Star)</option>
								<option value="bfs">BFS (Breadth-First)</option>
								<option value="greedy">Greedy Best-First</option>
							</Select>
						</Flex>
						<Flex
							ml={5}
							background="blue.50"
							py={4}
							px={5}
							rounded={5}
							direction="column"
							w="max-content">
							<Heading as="h4" size="sm" mr={[2, 5]}>
								Animation Speed
							</Heading>
							<Flex mt={3}>
								<Slider
									isReadOnly={isAnimating}
									isDisabled={isAnimating}
									maxWidth={['100px', '140px']}
									aria-label="slider"
									min={1}
									max={10}
									defaultValue={animationSpeed}
									onChange={onAnimationSpeedChange}>
									<SliderTrack bg="blue.100">
										<SliderFilledTrack bg="cyan.400" />
									</SliderTrack>
									<SliderThumb bg="cyan.600" />
								</Slider>
								<Text ml={4} fontWeight="bold" color="cyan.700">
									{animationSpeed}
								</Text>
							</Flex>
						</Flex>
						<Flex
							direction="column"
							background="blue.50"
							px={4}
							py={3}
							ml={5}
							my={isMobile ? 2 : 0}
							rounded={5}>
							<Heading as="h4" size="sm" mb={2}>
								Auto-generate Maze
							</Heading>
							<Select
								bg="white"
								value={usedMazeAlgo}
								onChange={onMazeAlgoChange}
								isDisabled={isAnimating}>
								<option value="">Choose maze algo</option>
								<option value="recursive-horizontal">
									Recursive (horizontal)
								</option>
								<option value="recursive-vertical">Recursive (vertical)</option>
								<option value="eller">Eller</option>
								<option value="prims">Prim's</option>
								<option value="kruskals">Kruskal's</option>
								<option value="sidewinder">Sidewinder</option>
							</Select>
						</Flex>
						<Flex
							background="blue.50"
							px={4}
							py={2}
							ml={5}
							rounded={5}
							direction="column"
							w="max-content">
							<Heading as="h4" size="sm">
								Manual Maze
							</Heading>
							<Flex mx="auto" mt={2}>
								<IconButton
									colorScheme={isPencil ? 'cyan' : 'gray'}
									onClick={() => onPencilChange(true)}
									aria-label="Pencil tool"
									icon={<Icon as={ImPencil2} />}
									mr={5}
									disabled={isAnimating}
								/>
								<IconButton
									colorScheme={!isPencil ? 'cyan' : 'gray'}
									onClick={() => onPencilChange(false)}
									aria-label="Eraser tool"
									icon={<Icon as={FaEraser} />}
									disabled={isAnimating}
								/>
							</Flex>
						</Flex>
						<Button
							colorScheme="red"
							disabled={isAnimating}
							onClick={onReset}
							ml={5}>
							Reset board
						</Button>
					</Flex>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	);
};
