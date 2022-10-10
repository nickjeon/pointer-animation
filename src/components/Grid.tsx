import styled from '@emotion/styled'
import { motion } from 'framer-motion'
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
`

function Grid() {
	const [columns, setColumns] = useState(0)
	const [rows, setRows] = useState(0)

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
		<Container columns={columns}>
			{Array.from({ length: columns * rows }).map((_, i) => (
				<Cell key={i} />
			))}
		</Container>
	)
}

export default Grid