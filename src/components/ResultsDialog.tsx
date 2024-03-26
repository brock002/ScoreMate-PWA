import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import Confetti from 'react-confetti'
import MuiTransition from './MuiTransition'
import { useFormData } from '@/contexts'

type ResultsDialogProps = {
	open: boolean,
	handleClose: () => void,
	handleFinishGame: () => void,
	totalScores: { [k: string]: number },
	players: { [k: string]: string },
}
type DialogSize = {
	height: number,
	width: number
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({ open, players, totalScores, handleClose, handleFinishGame, }) => {
	const { data } = useFormData()
	const dialogRoot = useRef<HTMLDivElement>(null)
	const [dialogSize, setDialogSize] = useState<DialogSize>({ height: 0, width: 0 })
	const totalScoresInOrder = useMemo(() =>
		Object.entries(totalScores)
			.sort((a, b) => data.reversedScoring ? a[1] - b[1] : b[1] - a[1])
			.map(item => [players[item[0]], item[1]]),
		[totalScores]
	)

	useEffect(() => {
		if (open && dialogRoot.current)
			setDialogSize({
				height: dialogRoot.current.clientHeight,
				width: dialogRoot.current.clientWidth,
			})
	}, [open])

	return (
		<Dialog
			open={open}
			TransitionComponent={MuiTransition}
			keepMounted
			maxWidth="sm"
			PaperProps={{
				ref: dialogRoot,
				sx: { overflow: 'hidden' }
			}}
			aria-describedby='results-dialog-desc'
			disableEscapeKeyDown
			fullWidth
		>
			{totalScoresInOrder.length > 0 &&
				<DialogTitle variant='h4' align='center'>{totalScoresInOrder[0][0]} wins..!</DialogTitle>
			}
			<DialogContent
				sx={{
					px: 3,
					'&.MuiDialogContent-root': {
						paddingTop: "4rem",
					},
				}}
			>
				<Grid container direction='column' rowSpacing={3}>
					<Typography variant='subtitle2' align='center'>Final Scores</Typography>
					{totalScoresInOrder.map((item, index) =>
						<Grid container direction='row' justifyContent='space-between' key={`results-final-scores-rows-${index}`}>
							<Typography variant='body1'>{item[0]}</Typography>
							<Typography variant='h6'>{item[1]}</Typography>
						</Grid>
					)}
				</Grid>
				<Confetti
					height={dialogSize.height}
					width={dialogSize.width}
					gravity={0.05}
					confettiSource={{ x: dialogSize.width / 4, y: dialogSize.height - 50, w: dialogSize.width / 2, h: 0 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button size='small' variant='contained' color='secondary' onClick={handleClose}>Continue Game</Button>
				<Button size='small' variant='contained' onClick={handleFinishGame}>End Game</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ResultsDialog
