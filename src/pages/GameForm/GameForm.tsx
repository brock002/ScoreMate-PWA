import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    Switch,
    TextField,
} from "@mui/material"
import { AppContextDispatchActions as DispatchActions } from "@/utils/types"
import { useFormData } from "@/contexts"
import { useSnackbar } from "notistack"

const GameForm: React.FC = () => {
    const navigate = useNavigate()
    const { data, currentGameData, dispatch } = useFormData()
    const { enqueueSnackbar } = useSnackbar()
    const [playerName, setPlayerName] = useState<string>("")

    useEffect(() => {
        if (currentGameData?.isGameRunning)
            navigate("/table", { replace: true })
    }, [currentGameData])

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

    const handleAddClick = () => {
        if (
            !!playerName &&
            data.players.every((player) => player !== playerName)
        ) {
            dispatch({
                type: DispatchActions.updateValue,
                payload: {
                    name: "players",
                    value: [...data.players, playerName],
                },
            })
            setPlayerName("")
        }
    }

    const handleSubmit = (): void => {
        if (data.players.length < 2) {
            enqueueSnackbar("Add a least 2 players to start the game...", {
                variant: "error",
            })
            return
        }
        dispatch({ type: DispatchActions.startGame })
        navigate("/table", { replace: true })
    }

    const handleDeletePlayer = (playerName: string) => () => {
        dispatch({
            type: DispatchActions.updateValue,
            payload: {
                name: "players",
                value: data.players.filter((player) => player !== playerName),
            },
        })
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

            {/* players */}
            <Grid item xs={12}>
                <TextField
                    label="Add Players"
                    variant="outlined"
                    name="new-player-name"
                    placeholder="player name"
                    helperText="add at least 2 players to start the game..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyDown={(e) => {
                        e.key === "Enter" && handleAddClick()
                    }}
                    size="small"
                    fullWidth
                    sx={{ padding: 0 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={handleAddClick}
                                >
                                    Add
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            {/* added players */}
            {data.players.length > 0 ? (
                <Grid item xs={12} color="text.primary">
                    Players added:{" "}
                    {data.players.map((item, index) => (
                        <Chip
                            label={item}
                            color="primary"
                            key={`player-items-${index}`}
                            sx={{ mx: 0.5 }}
                            onDelete={handleDeletePlayer(item)}
                        />
                    ))}
                </Grid>
            ) : null}

            <Grid item xs={12} mt={3}>
                <Divider sx={{ color: "text.primary" }}>Game Settings</Divider>
            </Grid>

            {/* Game title */}
            <Grid item xs={12}>
                <TextField
                    label="Title"
                    variant="outlined"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                />
            </Grid>

            {/* Maximum score */}
            <Grid item xs={12}>
                <TextField
                    label="Max. Score"
                    variant="outlined"
                    name="maxScore"
                    helperText="maximum score needed by a player to end the game..."
                    value={data.maxScore}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                />
            </Grid>

            {/* Maximum score per round */}
            <Grid item xs={12}>
                <TextField
                    label="Max. Score per Round"
                    variant="outlined"
                    name="maxScorePerRound"
                    helperText="combined score of all the players in a round..."
                    value={data.maxScorePerRound}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                />
            </Grid>

            {/* Maximum rounds */}
            <Grid item xs={12}>
                <TextField
                    label="Max. Number of Rounds"
                    variant="outlined"
                    name="maxRounds"
                    helperText="maximum no of rounds the game will go on for..."
                    value={data.maxRounds}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                />
            </Grid>

            {/* Reversed scoring */}
            <Grid item xs={12}>
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

            <Grid item xs={12}>
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
