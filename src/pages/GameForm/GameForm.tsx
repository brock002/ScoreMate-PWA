import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    Button,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Switch,
    TextField,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { ClearableFieldName } from "./GameForm.types"
import { AppContextDispatchActions as DispatchActions } from "@/utils/types"
import { useFormData } from "@/contexts"
import { useSnackbar } from "notistack"

// get end adornment with close icon
const getCloseIconAdornment = (
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
) => ({
    endAdornment: (
        <InputAdornment position="start">
            <IconButton size="small" onClick={handleClick}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </InputAdornment>
    ),
})

const GameForm: React.FC = () => {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { data, currentGameData, dispatch } = useFormData()
    const [playersCount, setPlayersCount] = useState<number>(2)
    const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2"])

    useEffect(() => {
        if (currentGameData?.isGameRunning)
            navigate("/table", { replace: true })
    }, [currentGameData])

    useEffect(() => {
        data.players.length > 0 && setPlayersCount(data.players.length)
    }, [])

    useEffect(() => {
        setPlayers((prev) =>
            [...Array(playersCount)].map(
                (_, index) =>
                    data.players[index] || prev[index] || `Player ${index + 1}`
            )
        )
    }, [playersCount])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (
            ["maxScore", "maxScorePerRound", "maxRounds"].includes(
                e.target.name
            )
        ) {
            e.target.value = e.target.value.replace(/[^0-9]+/g, "")
            dispatch({
                type: DispatchActions.updateValue,
                payload: {
                    name: e.target.name,
                    value: !!e.target.value ? Number(e.target.value) : "",
                },
            })
        } else if (e.target.name === "reversedScoring") {
            dispatch({
                type: DispatchActions.updateValue,
                payload: {
                    name: e.target.name,
                    value: e.target.checked,
                },
            })
        } else if (e.target.name === "title") {
            dispatch({
                type: DispatchActions.updateValue,
                payload: {
                    name: e.target.name,
                    value: e.target.value,
                },
            })
        }
    }

    const handleClearClick =
        (fieldName: ClearableFieldName = "") =>
        () => {
            if (!!fieldName)
                dispatch({
                    type: DispatchActions.updateValue,
                    payload: {
                        name: fieldName,
                        value: "",
                    },
                })
        }

    const handlePlayerUpdate =
        (changeIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({
                type: DispatchActions.updateValue,
                payload: {
                    name: "players",
                    value: [],
                },
            })
            setPlayers((prev) =>
                prev.map((item, index) =>
                    index === changeIndex ? e.target.value : item
                )
            )
        }

    const handlePlayerClearClick =
        (changeIndex: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
            const possibleAdjacentInput =
                e.currentTarget.parentElement?.previousElementSibling
            if (possibleAdjacentInput?.nodeName === "INPUT")
                (possibleAdjacentInput as HTMLElement).focus()

            setPlayers((prev) =>
                prev.map((item, index) => (index === changeIndex ? "" : item))
            )
        }

    const handleSubmit = (): void => {
        if (players.some((item) => !item)) {
            enqueueSnackbar("Player names cannot be empty...", {
                variant: "error",
            })
            return
        }
        dispatch({
            type: DispatchActions.updateValue,
            payload: {
                name: "players",
                value: players,
            },
        })
        dispatch({ type: DispatchActions.startGame })
        navigate("/table", { replace: true })
    }

    return (
        <Grid
            container
            sx={{
                gap: "1rem",
                "& .MuiOutlinedInput-root": {
                    paddingRight: 0,
                },
            }}
        >
            <Grid item xs={12} mt={0.5}>
                <Divider sx={{ color: "text.primary" }}>Players</Divider>
            </Grid>

            {/* players count */}
            <Grid container>
                <FormControlLabel
                    control={
                        <TextField
                            select
                            size="small"
                            value={playersCount}
                            variant="outlined"
                            sx={{ minWidth: 150 }}
                            onChange={(e) =>
                                setPlayersCount(Number(e.target.value))
                            }
                        >
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                                <MenuItem
                                    value={option}
                                    key={`players-count-options-${option}`}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    }
                    labelPlacement="start"
                    label="Players Count"
                    sx={{
                        "&.MuiFormControlLabel-root": {
                            width: "100%",
                            justifyContent: "space-between",
                            color: "text.secondary",
                            marginRight: 0,
                        },
                    }}
                />
            </Grid>

            <Grid container justifyContent="center">
                <Grid item xs={8}>
                    <Divider sx={{ color: "text.primary" }}>
                        Added Players
                    </Divider>
                </Grid>
            </Grid>

            {/* added players */}
            {players.map((item, index) => (
                <Grid container key={`game-players-items-${index}`}>
                    <TextField
                        size="small"
                        value={item}
                        variant="outlined"
                        label={`#${index + 1} Player Name`}
                        placeholder="Player Name"
                        onChange={handlePlayerUpdate(index)}
                        helperText={!item ? "player name cannot be empty" : ""}
                        InputLabelProps={{ shrink: true }}
                        error={!item}
                        fullWidth
                        InputProps={
                            !!item
                                ? {
                                      ...getCloseIconAdornment(
                                          handlePlayerClearClick(index)
                                      ),
                                  }
                                : {}
                        }
                    />
                </Grid>
            ))}

            <Grid item xs={12} mt={3}>
                <Divider sx={{ color: "text.primary" }}>Game Settings</Divider>
            </Grid>

            {/* Game title */}
            <Grid container>
                <TextField
                    label="Title"
                    variant="outlined"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                    InputProps={
                        !!data.title
                            ? {
                                  ...getCloseIconAdornment(
                                      handleClearClick("title")
                                  ),
                              }
                            : {}
                    }
                />
            </Grid>

            {/* Maximum score */}
            <Grid container>
                <TextField
                    label="Max. Score"
                    variant="outlined"
                    name="maxScore"
                    helperText="maximum score needed by a player to end the game..."
                    value={data.maxScore}
                    type="number"
                    onChange={handleChange}
                    size="small"
                    fullWidth
                    InputProps={
                        !!data.maxScore
                            ? {
                                  ...getCloseIconAdornment(
                                      handleClearClick("maxScore")
                                  ),
                              }
                            : {}
                    }
                />
            </Grid>

            {/* Maximum score per round */}
            <Grid container>
                <TextField
                    label="Max. Score per Round"
                    variant="outlined"
                    name="maxScorePerRound"
                    helperText="combined score of all the players in a round..."
                    value={data.maxScorePerRound}
                    type="number"
                    onChange={handleChange}
                    size="small"
                    fullWidth
                    InputProps={
                        !!data.maxScorePerRound
                            ? {
                                  ...getCloseIconAdornment(
                                      handleClearClick("maxScorePerRound")
                                  ),
                              }
                            : {}
                    }
                />
            </Grid>

            {/* Maximum rounds */}
            <Grid container>
                <TextField
                    label="Max. Number of Rounds"
                    variant="outlined"
                    name="maxRounds"
                    helperText="maximum no of rounds the game will go on for..."
                    value={data.maxRounds}
                    onChange={handleChange}
                    type="number"
                    size="small"
                    fullWidth
                    InputProps={
                        !!data.maxRounds
                            ? {
                                  ...getCloseIconAdornment(
                                      handleClearClick("maxRounds")
                                  ),
                              }
                            : {}
                    }
                />
            </Grid>

            {/* Reversed scoring */}
            <Grid container>
                <FormControlLabel
                    control={
                        <Switch
                            checked={data.reversedScoring}
                            onChange={handleChange}
                            name="reversedScoring"
                        />
                    }
                    labelPlacement="start"
                    label="Reversed Scoring"
                    sx={{
                        "&.MuiFormControlLabel-root": {
                            width: "100%",
                            justifyContent: "space-between",
                            color: "text.secondary",
                        },
                    }}
                />
            </Grid>

            <Grid container>
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    fullWidth
                >
                    Start Game
                </Button>
            </Grid>
        </Grid>
    )
}

export default GameForm
