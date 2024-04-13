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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { AppContextDispatchActions as DispatchActions } from "@/utils/types"
import { Player, Scores } from "./ScoreTable.types"
import {
    CONFIRMATION_DIALOG_INITIAL_PROPS,
    CONFIRMATION_DIALOG_PROPS,
} from "./ScoreTable.constants"
import {
    ConfirmationDialog,
    ResultsDialog,
    StickyTableCell,
} from "@/components"
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
    borderRadius: 16,
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
    const [confirmationDialogProps, setConfirmationDialogProps] = useState(
        CONFIRMATION_DIALOG_INITIAL_PROPS
    )
    const [showFooterCollapse, setShowFooterCollapse] = useState<boolean>(false)
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
        ) {
            setIsGameComplete(true)
            setShowFooterCollapse(false)
        }
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
        // calculate current round total
        const currentRoundTotal = Object.values(scores[currentRound]).reduce(
            (total, item) => (!!item ? Number(total) + Number(item) : total),
            0
        )

        // check if round is empty
        if (!currentRoundTotal) return

        // total validation
        if (
            !!data.maxScorePerRound &&
            currentRoundTotal !== data.maxScorePerRound
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

    const handleDeleteConfirm = (roundIndex: number) => (): void => {
        setScores((prev) => {
            const newScores = prev.filter((_, index) => index !== roundIndex)
            updateScoresToContext(newScores)
            return newScores
        })
        setCurrentRound((prev) => prev - 1)
        handleConfirmationModalClose()
    }

    const handleDelete = (roundIndex: number) => (): void => {
        setConfirmationDialogProps({
            ...CONFIRMATION_DIALOG_PROPS["confirmDeleteRound"],
            handleConfirm: handleDeleteConfirm(roundIndex),
        })
        setShowConfirmationDialog(true)
    }

    const handleResultsModalClose = () => setIsGameComplete(false)

    const handleConfirmationModalClose = () => setShowConfirmationDialog(false)

    const handleResetGameConfirm = () => {
        setScores(() => {
            const initialScores = [
                Object.fromEntries(
                    data.players.map((_, index) => [`player${index}`, ""])
                ),
            ]
            updateScoresToContext(initialScores)
            return initialScores
        })
        setCurrentRound(0)
        handleResultsModalClose()
        handleConfirmationModalClose()
    }

    const handleResetGameClick = () => {
        setConfirmationDialogProps({
            ...CONFIRMATION_DIALOG_PROPS["confirmReset"],
            handleConfirm: handleResetGameConfirm,
        })
        setShowConfirmationDialog(true)
    }

    const handleFinishGameClick = () => setIsGameComplete(true)

    const handleFinishGame = () => {
        setIsGameComplete(false)
        dispatch({ type: DispatchActions.finishGame })
        navigate("/", { replace: true })
    }

    return (
        <>
            <>
                {/* game details section */}
                <Grid
                    container
                    justifyContent="space-between"
                    rowGap={2}
                    sx={{ height: "fit-content" }}
                >
                    <Grid container>
                        <Grid container>
                            <Typography variant="h5" color="text.primary">
                                {data.title || "Game"}
                            </Typography>
                        </Grid>
                        <Grid container>
                            <Typography variant="body1" color="text.secondary">
                                Started{" "}
                                {moment(currentGameData?.startTime).fromNow()}
                            </Typography>
                        </Grid>
                        {data.maxScore ? (
                            <Grid
                                container
                                justifyContent="space-between"
                                pt={0.5}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Max. Score
                                </Typography>
                                <InfoText label={data.maxScore} />
                            </Grid>
                        ) : null}
                        {data.maxScorePerRound ? (
                            <Grid
                                container
                                justifyContent="space-between"
                                pt={0.5}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Max. Score per Round
                                </Typography>
                                <InfoText label={data.maxScorePerRound} />
                            </Grid>
                        ) : null}
                        {data.maxRounds ? (
                            <Grid
                                container
                                justifyContent="space-between"
                                pt={0.5}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Max. Number of Rounds
                                </Typography>
                                <InfoText label={data.maxRounds} />
                            </Grid>
                        ) : null}
                        {data.reversedScoring ? (
                            <Grid
                                container
                                justifyContent="space-between"
                                pt={0.5}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="text.primary"
                                >
                                    Reversed Scoring
                                </Typography>
                                <InfoText label="True" />
                            </Grid>
                        ) : null}
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        gap={1}
                        justifyContent={{ xs: "flex-end" }}
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

                {/* table */}
                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                        mt: 1.5,
                        height: "fit-content",
                        maxHeight: "60vh",
                        "&.MuiTableContainer-root .MuiTableRow-root .MuiTableCell-root:first-child":
                            {
                                width: "3.75rem",
                            },
                    }}
                >
                    <Table stickyHeader aria-label="scores-table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        left: 0,
                                        zIndex: 15,
                                        backgroundColor: "background.paper",
                                        filter: "brightness(70%)",
                                    }}
                                />
                                {Object.keys(players).map((item, index) => (
                                    <TableCell
                                        align="center"
                                        key={`players-items-${index}`}
                                        sx={{
                                            zIndex: 5,
                                            backgroundColor: "background.paper",
                                            filter: "brightness(95%)",
                                        }}
                                    >
                                        {players[item]}
                                    </TableCell>
                                ))}
                                <TableCell
                                    sx={{
                                        right: 0,
                                        zIndex: 15,
                                        backgroundColor: "background.paper",
                                        filter: "brightness(70%)",
                                    }}
                                />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores.map((row, index) => (
                                <TableRow
                                    key={`score-table-rows-items-${index}`}
                                >
                                    <StickyTableCell sx={{ left: 0 }}>
                                        # {index + 1}
                                    </StickyTableCell>
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
                                                    type="number"
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
                                    <StickyTableCell
                                        align="center"
                                        sx={{ right: 0 }}
                                    >
                                        {currentRound === index ? (
                                            <IconButton
                                                color="success"
                                                title="Save Round"
                                                onClick={handleSave}
                                            >
                                                <CheckCircleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="error"
                                                title="Delete Round"
                                                onClick={handleDelete(index)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        )}
                                    </StickyTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter
                            sx={
                                !showFooterCollapse
                                    ? {
                                          "&.MuiTableFooter-root .MuiTableRow-root:first-child .MuiTableCell-root":
                                              {
                                                  borderBottom: "none",
                                              },
                                      }
                                    : {}
                            }
                        >
                            {/* score total row */}
                            <TableRow>
                                <StickyTableCell sx={{ left: 0 }}>
                                    Total
                                </StickyTableCell>
                                {Object.keys(players).map((item, index) => (
                                    <TableCell
                                        align="center"
                                        key={`players-total-scores-items-${index}`}
                                    >
                                        {totalScores[item]}
                                    </TableCell>
                                ))}
                                <StickyTableCell
                                    align="center"
                                    sx={{ right: 0 }}
                                >
                                    {Number(data.maxScore) > 0 ? (
                                        <IconButton
                                            aria-label="expand-footer"
                                            size="small"
                                            onClick={() =>
                                                setShowFooterCollapse(
                                                    (prev) => !prev
                                                )
                                            }
                                        >
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform:
                                                        showFooterCollapse
                                                            ? "rotate(180deg)"
                                                            : "rotate(0deg)",
                                                }}
                                            />
                                        </IconButton>
                                    ) : null}
                                </StickyTableCell>
                            </TableRow>

                            {/* score remaining total row */}
                            {showFooterCollapse ? (
                                <TableRow>
                                    <StickyTableCell sx={{ left: 0 }} />
                                    {Object.keys(players).map((item, index) => (
                                        <TableCell
                                            align="center"
                                            key={`players-total-scores-need-to-win-items-${index}`}
                                        >
                                            {Number(data.maxScore) -
                                                totalScores[item]}
                                        </TableCell>
                                    ))}
                                    <StickyTableCell sx={{ right: 0 }} />
                                </TableRow>
                            ) : null}
                        </TableFooter>
                    </Table>
                </TableContainer>
            </>

            {/* results dialog */}
            <ResultsDialog
                open={isGameComplete}
                players={players}
                totalScores={totalScores}
                handleClose={handleResultsModalClose}
                handleFinishGame={handleFinishGame}
            />

            {/* confirmation dialog */}
            <ConfirmationDialog
                open={showConfirmationDialog}
                title={confirmationDialogProps.title}
                content={confirmationDialogProps.content}
                actions={[
                    {
                        label: "Cancel",
                        handleClick: handleConfirmationModalClose,
                    },
                    {
                        label: "Confirm",
                        handleClick: confirmationDialogProps.handleConfirm,
                    },
                ]}
            />
        </>
    )
}

export default ScoreTable
