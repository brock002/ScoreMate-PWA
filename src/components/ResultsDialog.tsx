import React, { useMemo } from "react"
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    Typography,
} from "@mui/material"
import Confetti from "react-confetti"
import MuiTransition from "./MuiTransition"
import { useColorModes, useFormData } from "@/contexts"
import { TROPHY_ICON_SRCS } from "@/utils/constants"
import gold_cup from "@/assets/icons/trophy1-512.png"
import silver_cup from "@/assets/icons/trophy2-512.png"
import bronze_cup from "@/assets/icons/trophy3-512.png"

type ResultsDialogProps = {
    open: boolean
    handleClose: () => void
    totalScores: { [k: string]: number }
    players: { [k: string]: string }
}
const ResultsDialog: React.FC<ResultsDialogProps> = ({
    open,
    players,
    totalScores,
    handleClose,
}) => {
    const { data } = useFormData()
    const { colorMode } = useColorModes()
    const totalScoresInOrder = useMemo(
        () =>
            Object.entries(totalScores)
                .sort((a, b) =>
                    data.reversedScoring ? a[1] - b[1] : b[1] - a[1]
                )
                .map((item) => [players[item[0]], item[1]]),
        [totalScores]
    )

    const getTrophyIcon = (position: number) => {
        const icon = TROPHY_ICON_SRCS[position - 1]
        return icon ? (
            <img
                src={icon}
                alt={`${position - 1} cup`}
                style={{
                    height: "1.1rem",
                    width: "2.375rem",
                    padding: "0 0.625rem",
                }}
            />
        ) : (
            <Chip
                label={`${position}th`}
                variant="outlined"
                color={colorMode === "light" ? "info" : "warning"}
                sx={{
                    height: "1.75rem",
                    width: "2.375rem",
                    ".MuiChip-label": { px: 0 },
                }}
            />
        )
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={MuiTransition}
            keepMounted
            maxWidth="sm"
            PaperProps={{
                sx: { overflow: "hidden" },
            }}
            aria-describedby="results-dialog-desc"
            disableEscapeKeyDown
            fullWidth
        >
            <DialogContent
                sx={{
                    px: 3,
                    "&.MuiDialogContent-root": {
                        paddingTop: "4rem",
                    },
                }}
            >
                <Grid container direction="column" rowSpacing={3}>
                    {/* current standing cups */}
                    <Grid container>
                        <Grid
                            item
                            xs={4}
                            container
                            justifyContent="center"
                            alignItems="flex-end"
                        >
                            <img
                                src={bronze_cup}
                                alt="bronze cup"
                                style={{
                                    height: "70%",
                                    width: "70%",
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            justifyContent="center"
                            alignItems="flex-end"
                        >
                            <img
                                src={gold_cup}
                                alt="gold cup"
                                style={{
                                    height: "100%",
                                    width: "100%",
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            justifyContent="center"
                            alignItems="flex-end"
                        >
                            <img
                                src={silver_cup}
                                alt="silver cup"
                                style={{
                                    height: "85%",
                                    width: "85%",
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* current standing names */}
                    <Grid container justifyContent="space-between">
                        {totalScoresInOrder.slice(0, 3).map((item, index) => (
                            <Grid
                                item
                                xs={4}
                                container
                                justifyContent="center"
                                key={`final-scores-positions-items-${index}`}
                            >
                                <Typography
                                    variant="h6"
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {item[0]}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    {/* final scores */}
                    <Divider sx={{ color: "text.primary", mt: 5 }}>
                        Final Scores
                    </Divider>
                    {totalScoresInOrder.map((item, index) => (
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            key={`results-final-scores-rows-${index}`}
                        >
                            <Typography variant="body1">{item[0]}</Typography>
                            <Grid
                                item
                                container
                                xs={6}
                                justifyContent="flex-end"
                                alignItems="center"
                                columnGap={1}
                            >
                                <Typography variant="h6">{item[1]}</Typography>
                                {getTrophyIcon(index + 1)}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>

                <Confetti height={220} gravity={0.01} />
            </DialogContent>

            <DialogActions>
                <Button
                    size="small"
                    variant="contained"
                    onClick={handleClose}
                    fullWidth
                >
                    close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ResultsDialog
