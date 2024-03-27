import React, { useEffect, useMemo, useState } from "react"
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    TableFooter,
    Grid,
    Typography,
    Chip,
    IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import { AppContextDispatchActions as DispatchActions } from "@/utils/types"
import { Player, Scores } from "./ScoreTable.types"
import { ConfirmationDialog, ResultsDialog } from "@/components"
import { useNavigate } from "react-router-dom"
import { useFormData } from "@/contexts"
import { useSnackbar } from "notistack"
import moment from "moment"

const INITIAL_SCORES = [
    {
        player0: "",
        player1: "",
        player2: "",
        player3: "",
    },
]
const InfoText = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 4,
    color: "white",
    height: "1.75rem",
    "& span": {
        padding: "0.5rem",
    },
}))

const ScoreTable = () => {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { data, currentGameData, dispatch } = useFormData()
    const [players, setPlayers] = useState<Player>({
        player0: "Player 1",
        player1: "Player 2",
        player2: "Player 3",
        player3: "Player 4",
    })
    const [scores, setScores] = useState<Scores[]>(INITIAL_SCORES)
    const [currentRound, setCurrentRound] = useState<number>(0)
    const [isGameComplete, setIsGameComplete] = useState<boolean>(false)
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false)
    const totalScores = useMemo(
        () =>
            Object.fromEntries(
                Object.keys(players).map((player) => [
                    player,
                    scores.reduce(
                        (total, currentRound) =>
                            !!currentRound[player]
                                ? total + Number(currentRound[player])
                                : total,
                        0
                    ),
                ])
            ),
        [currentRound]
    )

    useEffect(() => {
        if (data.players.length > 0)
            setPlayers(
                Object.fromEntries(
                    data.players.map((player, index) => [
                        `player${index}`,
                        player,
                    ])
                )
            )
        else navigate("/", { replace: true })
    }, [data.players])

    useEffect(() => {
        // console.log('getting called with string', currentGameData?.scoresStr, 'players', players, 'scores', scores);
        if (
            scores.length === 1 &&
            Object.values(scores[0]).every((item) => !item)
        ) {
            if (!!currentGameData?.scoresStr) {
                const scoresData = JSON.parse(currentGameData.scoresStr)
                setScores(scoresData)
                setCurrentRound((scoresData?.length || 1) - 1)
            } else
                setScores([
                    Object.fromEntries(
                        data.players.map((_, index) => [`player${index}`, ""])
                    ),
                ])
        }
    }, [players, currentGameData])

    useEffect(() => {
        if (
            Number(data.maxScore) > 0 &&
            Object.values(totalScores).some(
                (item) => item >= Number(data.maxScore)
            )
        )
            setIsGameComplete(true)
    }, [totalScores])

    useEffect(() => {
        if (Number(data.maxRounds) > 0 && data.maxRounds === currentRound)
            setIsGameComplete(true)
    }, [currentRound])

    const updateScoresToContext = (scores: Scores[]) =>
        dispatch({
            type: DispatchActions.updateCurrentGameScores,
            payload: { scores },
        })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value.replace(/[^0-9]+/g, "")
        setScores((prev) =>
            prev.map((item, index) =>
                index === currentRound
                    ? {
                          ...item,
                          [e.target.name]: !!newValue ? Number(newValue) : "",
                      }
                    : item
            )
        )
    }

    const handleSave = (): void => {
        // total validation
        if (
            !!data.maxScorePerRound &&
            Object.values(scores[currentRound]).reduce(
                (total, item) =>
                    !!item ? Number(total) + Number(item) : total,
                0
            ) !== data.maxScorePerRound
        ) {
            enqueueSnackbar(
                `Current round total is not equal to ${data.maxScorePerRound}`,
                { variant: "error" }
            )
            return
        }

        // update scores
        setScores((prev) => {
            const newScores = [
                ...prev.map((row, index) =>
                    index !== currentRound
                        ? row
                        : Object.fromEntries(
                              Object.keys(row).map((item) => [
                                  item,
                                  !!row[item] ? row[item] : 0,
                              ])
                          )
                ),
                Object.fromEntries(
                    Object.keys(players).map((item) => [item, ""])
                ),
            ]
            updateScoresToContext(newScores)
            return newScores
        })
        setCurrentRound((prev) => prev + 1)
    }

    const handleDelete = (roundIndex: number) => (): void => {
        setScores((prev) => {
            const newScores = prev.filter((_, index) => index !== roundIndex)
            updateScoresToContext(newScores)
            return newScores
        })
        setCurrentRound((prev) => prev - 1)
    }

    const handleResultsModalClose = () => setIsGameComplete(false)

    const handleResetGameClick = () => setShowConfirmationDialog(true)

    const handleConfirmationModalClose = () => setShowConfirmationDialog(false)

    const handleFinishGameClick = () => setIsGameComplete(true)

    const handleFinishGame = () => {
        setIsGameComplete(false)
        dispatch({ type: DispatchActions.finishGame })
        navigate("/", { replace: true })
    }

    const handleResetGameConfirm = () => {
        setScores(INITIAL_SCORES)
        updateScoresToContext(INITIAL_SCORES)
        setCurrentRound(0)
        handleConfirmationModalClose()
        handleResultsModalClose()
    }

    return (
        <>
            <>
                <Grid
                    container
                    justifyContent="space-between"
                    px={1}
                    rowGap={{ xs: 2, sm: 0 }}
                    sx={{ height: "fit-content" }}
                    direction={{ xs: "column-reverse", sm: "row" }}
                >
                    <Grid container item xs={6} direction="column">
                        <Typography variant="h5" color="text.primary">
                            Game
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Started{" "}
                            {moment(currentGameData?.startTime).fromNow()}
                        </Typography>
                        {data.maxScore && (
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Max. Score: <InfoText label={data.maxScore} />
                            </Typography>
                        )}
                        {data.maxScorePerRound && (
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Max. Score per Round:{" "}
                                <InfoText label={data.maxScorePerRound} />
                            </Typography>
                        )}
                        {data.maxRounds && (
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Max. Number of Rounds:{" "}
                                <InfoText label={data.maxRounds} />
                            </Typography>
                        )}
                        {data.reversedScoring && (
                            <Typography
                                variant="subtitle1"
                                color="text.primary"
                            >
                                Reversed Scoring: <InfoText label="True" />
                            </Typography>
                        )}
                    </Grid>
                    <Grid
                        container
                        item
                        xs={6}
                        gap={1}
                        justifyContent={{ xs: "center", sm: "flex-end" }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={handleResetGameClick}
                            sx={{ height: "fit-content" }}
                        >
                            Reset Game
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleFinishGameClick}
                            sx={{ height: "fit-content" }}
                        >
                            Finish Game
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{ mt: 1.5 }}
                >
                    <Table aria-label="scores-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Round</TableCell>
                                {Object.keys(players).map((item, index) => (
                                    <TableCell
                                        align="center"
                                        key={`players-items-${index}`}
                                    >
                                        {players[item]}
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores.map((row, index) => (
                                <TableRow
                                    key={`score-table-rows-items-${index}`}
                                >
                                    <TableCell component="th" scope="row">
                                        # {index + 1}
                                    </TableCell>
                                    {Object.keys(row).map((item, itemIndex) => (
                                        <TableCell
                                            align="center"
                                            key={`score-table-row-${index}-column-items-${itemIndex}`}
                                        >
                                            {currentRound === index ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name={item}
                                                    value={row[item]}
                                                    onChange={handleChange}
                                                    sx={{
                                                        maxWidth: 100,
                                                        minWidth: 75,
                                                    }}
                                                />
                                            ) : (
                                                row[item]
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        {currentRound === index ? (
                                            <IconButton
                                                color="success"
                                                title="Save"
                                                onClick={handleSave}
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="error"
                                                onClick={handleDelete(index)}
                                                title="Delete"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter
                            sx={{
                                "&.MuiTableFooter-root .MuiTableCell-root": {
                                    borderBottom: "none",
                                },
                            }}
                        >
                            <TableRow>
                                <TableCell>Total</TableCell>
                                {Object.keys(players).map((item, index) => (
                                    <TableCell
                                        align="center"
                                        key={`players-total-scores-items-${index}`}
                                    >
                                        {totalScores[item]}
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>
            <ResultsDialog
                open={isGameComplete}
                players={players}
                totalScores={totalScores}
                handleClose={handleResultsModalClose}
                handleFinishGame={handleFinishGame}
            />
            <ConfirmationDialog
                open={showConfirmationDialog}
                title="Confirm Reset"
                content="If you confirm the scores will reset. Are you sure you want to reset the game.?"
                actions={[
                    {
                        label: "Cancel",
                        handleClick: handleConfirmationModalClose,
                    },
                    {
                        label: "Confirm",
                        handleClick: handleResetGameConfirm,
                    },
                ]}
            />
        </>
    )
}

export default ScoreTable
