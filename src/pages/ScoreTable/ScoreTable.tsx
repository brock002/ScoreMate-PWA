import React, { useEffect, useMemo, useState, useRef } from "react"
import {
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
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
// import ShareIcon from "@mui/icons-material/Share"
import CloseIcon from "@mui/icons-material/Close"
import ReplayIcon from "@mui/icons-material/Replay"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { AppContextDispatchActions as DispatchActions } from "@/utils/types"
import { Player, Scores } from "./ScoreTable.types"
import {
    CONFIRMATION_DIALOG_INITIAL_PROPS,
    CONFIRMATION_DIALOG_PROPS,
} from "./ScoreTable.constants"
import {
    ConfirmationDialog,
    ResultsDialog,
    TableRowWithChipHeader,
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
    let scoreInputRefs: React.MutableRefObject<
        React.MutableRefObject<HTMLInputElement | null>[]
    > = useRef([])
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const showMenu = Boolean(anchorEl)
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
        if (Number(data.maxScore) > 0) setShowFooterCollapse(true)
    }, [data.maxScore])

    useEffect(() => {
        if (data.players.length > 0) {
            setPlayers(
                Object.fromEntries(
                    data.players.map((player, index) => [
                        `player${index}`,
                        player,
                    ])
                )
            )
            scoreInputRefs.current = Object.keys(data.players).map(() =>
                React.createRef()
            )
        } else navigate("/", { replace: true })
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
        // focus on first column input
        scoreInputRefs.current?.[0]?.current?.focus()

        // check if max rounds are completed or check if max score is achieved
        if (
            (Number(data.maxRounds) > 0 && data.maxRounds === currentRound) ||
            (Number(data.maxScore) > 0 &&
                Object.values(totalScores).some(
                    (item) => item >= Number(data.maxScore)
                ))
        )
            setIsGameComplete(true)
    }, [totalScores])

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

    // save current row scores
    const saveRow = (): void => {
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

    const handleInputKeyDown =
        (colIndex: number) =>
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (!["Enter", "Tab"].includes(e.key)) return

            e.preventDefault()
            const playersCount = Object.keys(players).length
            if (colIndex + 1 === playersCount) {
                saveRow()
            } else {
                scoreInputRefs.current[colIndex + 1].current?.focus()
            }
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
        handleCloseMenu()
        setShowConfirmationDialog(true)
    }

    const handleShowFinalScoresClick = () => setIsGameComplete(true)

    const handleFinishGameConfirm = () => {
        setIsGameComplete(false)
        dispatch({ type: DispatchActions.finishGame })
        navigate("/", { replace: true })
    }

    const handleFinishGameClick = () => {
        setConfirmationDialogProps({
            ...CONFIRMATION_DIALOG_PROPS["confirmEnd"],
            handleConfirm: handleFinishGameConfirm,
        })
        handleCloseMenu()
        setShowConfirmationDialog(true)
    }

    const handleMoreOptionsClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => setAnchorEl(event.currentTarget)

    const handleCloseMenu = () => setAnchorEl(null)

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
                        <Grid container justifyContent="space-between">
                            <Typography variant="h5" color="text.primary">
                                {data.title || "Game"}
                            </Typography>
                            <Grid item>
                                {/* <IconButton title="share">
                                    <ShareIcon />
                                </IconButton> */}
                                <IconButton
                                    title="view final scores"
                                    onClick={handleShowFinalScoresClick}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                    title="more options"
                                    onClick={handleMoreOptionsClick}
                                    sx={{ pr: 0 }}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Grid>
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
                </Grid>

                {/* table */}
                <TableContainer
                    component={Paper}
                    elevation={2}
                    sx={{
                        mt: 2.5,
                        height: "fit-content",
                        maxHeight: "60vh",
                        // "&.MuiTableContainer-root .MuiTableRow-root .MuiTableCell-root:first-of-type":
                        //     {
                        //         width: "3.75rem",
                        //     },
                    }}
                >
                    <Table stickyHeader aria-label="scores-table">
                        <TableHead>
                            <TableRow>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores.map((row, index) => (
                                <TableRowWithChipHeader
                                    columnsCount={Object.keys(players).length}
                                    header={`# ${index + 1}`}
                                    key={`score-table-rows-items-${index}`}
                                    onDelete={
                                        currentRound === index
                                            ? undefined
                                            : handleDelete(index)
                                    }
                                >
                                    {Object.keys(row).map((item, itemIndex) => (
                                        <TableCell
                                            align="center"
                                            key={`score-table-row-${index}-column-items-${itemIndex}`}
                                            sx={{
                                                borderBottom: "none",
                                            }}
                                        >
                                            {currentRound === index ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name={item}
                                                    inputProps={{
                                                        ref: scoreInputRefs
                                                            .current?.[
                                                            itemIndex
                                                        ],
                                                    }}
                                                    value={row[item]}
                                                    type="number"
                                                    onChange={handleChange}
                                                    onKeyDown={handleInputKeyDown(
                                                        itemIndex
                                                    )}
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
                                </TableRowWithChipHeader>
                            ))}
                        </TableBody>
                        <TableFooter
                            sx={{
                                [`&.MuiTableFooter-root .MuiTableRow-root .MuiTableCell-root`]:
                                    {
                                        borderBottom: "none",
                                    },
                            }}
                        >
                            {/* score total row */}
                            <TableRowWithChipHeader
                                columnsCount={Object.keys(players).length}
                                header="Total"
                            >
                                {Object.keys(players).map((item, index) => (
                                    <TableCell
                                        align="center"
                                        key={`players-total-scores-items-${index}`}
                                        sx={{
                                            fontSize: "0.875rem",
                                            fontWeight: 750,
                                        }}
                                    >
                                        {totalScores[item]}
                                    </TableCell>
                                ))}
                            </TableRowWithChipHeader>

                            {/* score remaining total row */}
                            {showFooterCollapse ? (
                                <TableRowWithChipHeader
                                    columnsCount={Object.keys(players).length}
                                    header="Score to Win"
                                >
                                    {Object.keys(players).map((item, index) => (
                                        <TableCell
                                            align="center"
                                            key={`players-total-scores-need-to-win-items-${index}`}
                                        >
                                            {Number(data.maxScore) -
                                                totalScores[item]}
                                        </TableCell>
                                    ))}
                                </TableRowWithChipHeader>
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

            {/* more options menu */}
            <Menu
                id="more-options-menu"
                anchorEl={anchorEl}
                open={showMenu}
                onClose={handleCloseMenu}
                MenuListProps={{
                    "aria-labelledby": "more-options-menu-buttons",
                }}
            >
                <MenuItem onClick={handleResetGameClick}>
                    <ListItemIcon>
                        <ReplayIcon />
                    </ListItemIcon>
                    Reset Game
                </MenuItem>
                <Divider sx={{ color: "text.primary" }} />
                <MenuItem onClick={handleFinishGameClick}>
                    <ListItemIcon>
                        <CloseIcon />
                    </ListItemIcon>
                    End Game
                </MenuItem>
            </Menu>
        </>
    )
}

export default ScoreTable
