import styled from '@emotion/styled'

export const CELL_SIZE = 60

const Container = styled.div`
	width: ${CELL_SIZE}px;
	height: ${CELL_SIZE}px;
	border: 1px dashed #555;
	color: #777;
	display: flex;
	justify-content: center;
	aligh-items: center;
	user-select: none;
`;

const Cell: React.FC = () => {
	return <Container>→</Container>
}

export default Cell