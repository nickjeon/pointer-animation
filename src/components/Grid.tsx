import styled from '@emotion/styled'
import {
	animate,
	AnimationOptions,
	motion,
	useMotionValue,
	useTransform,
	useMotionTemplate,
	useVelocity
} from 'framer-motion'
import { useEffect, useState } from 'react'
import Cell, { CELL_SIZE } from './Cell'

const Container = styled(motion.div)<{
	columns: number;
}>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	display: grid;
	grid-template-columns: repeat(${(props) => props.columns}, 1fr);
	mask-image: radial-gradient(
		300px 300px,
		rgba(0, 0, 0, 1),
		rgba(0, 0, 0, 0.4),
		transparent
	);
	mask-repeat: no-repeat;
`

function Grid() {
	const [columns, setColumns] = useState(0)
	const [rows, setRows] = useState(0)

	// mouse position
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	const centerMouseX = useTransform<number, number>(mouseX, (newX) => {
		return newX - window.innerWidth / 2
	})
	const centerMouseY = useTransform<number, number>(mouseY, (newY) => {
		return newY - window.innerHeight / 2
	})
	const WebkitMaskPosition = useMotionTemplate`${centerMouseX}px ${centerMouseY}px`

	// eased mouse position
	const mouseXEased = useMotionValue(0)
	const mouseYEased = useMotionValue(0)

	// mouse velocity
	const mouseXVelocity = useVelocity(mouseXEased)
	const mouseYVelocity = useVelocity(mouseYEased)
	const mouseVelocity = useTransform<number, number>(
		[mouseXVelocity, mouseYVelocity],
		([latestX, latestY]) => Math.abs(latestX) + Math.abs(latestY)
	)
	// map mouse velocity to an opacity value
	const opacity = useTransform(mouseVelocity, [0, 1000], [0, 1])

	// handle mouse move on document
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// animate mouse x and y
			animate(mouseX, e.clientX)
			animate(mouseY, e.clientY)
			// animate eased mouse x and y
			const transition: AnimationOptions<number> = {
				ease: 'easeOut',
				duration: 1,
			}
			animate(mouseXEased, e.clientX, transition)
			animate(mouseYEased, e.clientY, transition)
		}
		// recalculate grid on resize
		window.addEventListener('mousemove', handleMouseMove)

		// cleanup
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	// determine rows and columns
	useEffect(() => {
		const calculateGrid = () => {
			const columnCount = Math.ceil(window.innerWidth / CELL_SIZE)
			setColumns(columnCount)
			const rowCount = Math.ceil(window.innerHeight / CELL_SIZE)
			setRows(rowCount)
		}
		// calculate the grid on load
		calculateGrid()
		// recalculate grid on resize
		window.addEventListener('resize', calculateGrid)
		// cleanup
		return () => {
			window.removeEventListener('resize', calculateGrid)
		}
	}, [])

	return (
		<Container columns={columns} style={{ WebkitMaskPosition }}>
			{Array.from({ length: columns * rows }).map((_, i) => (
				<Cell key={i} mouseX={mouseX} mouseY={mouseY} />
			))}
		</Container>
	)
}

export default Grid