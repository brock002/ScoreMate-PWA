import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    Typography,
} from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import LogoIcon from "@/assets/logo-icon.png"
import { useColorModes } from "@/contexts"
import { Logo } from "@/components"

const BaseLayout = () => {
    const { colorMode, toggleColorMode } = useColorModes()
    const [showAbout, setShowAbout] = useState(false)

    return (
        <Grid
            container
            sx={{
                backgroundColor: "background.default",
                padding: "0.5rem 0",
                height: "100vh",
                overflowY: "scroll",
            }}
        >
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                sx={{
                    m: { xs: "1rem auto", md: "2rem auto" },
                    maxWidth: { xs: 0.95, md: 0.7 },
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                }}
            >
                {/* header */}
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    component="header"
                    sx={(theme) => ({
                        backgroundColor: theme.palette.background.paper,
                        height: "fit-content",
                        padding: "0.5rem",
                        borderRadius: 1,
                        mb: 4,
                    })}
                >
                    <Grid item xs={8} sm={6} ml={{ xs: 0.25, sm: 1.5 }}>
                        <Logo />
                    </Grid>
                    <IconButton
                        sx={{ m: 1 }}
                        onClick={toggleColorMode}
                        color="inherit"
                        title={
                            colorMode === "light" ? "dark mode" : "light mode"
                        }
                    >
                        {colorMode === "light" ? (
                            <Brightness4Icon />
                        ) : (
                            <Brightness7Icon
                                sx={(theme) => ({
                                    color: theme.palette.text.primary,
                                })}
                            />
                        )}
                    </IconButton>
                </Grid>

                {/* children components */}
                <Container component="main" maxWidth={false} sx={{ px: 0 }}>
                    <Outlet />
                </Container>

                {/* analytics */}
                <Analytics />

                {/* footer */}
                <Grid
                    container
                    component="footer"
                    justifyContent="center"
                    direction="column"
                    rowGap={1.5}
                    mt={6}
                >
                    <Divider sx={{ color: "text.primary" }} />

                    <Accordion
                        expanded={showAbout}
                        onChange={() => setShowAbout((prev) => !prev)}
                        sx={{
                            backgroundColor: "background.default",
                            boxShadow: "none",
                        }}
                    >
                        <AccordionSummary
                            aria-controls="about-panel-content"
                            id="about-panel-content"
                            sx={{ backgroundColor: "background.default" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                            >
                                <img
                                    src={LogoIcon}
                                    alt="LOGO"
                                    height={20}
                                    width={20}
                                    style={{ marginRight: "0.25rem" }}
                                />
                                <Typography variant="h6" color="text.primary">
                                    About Score Mate
                                </Typography>
                                <ExpandMoreIcon
                                    sx={{
                                        transform: showAbout
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                />
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                borderRadius: 1,
                                backgroundColor: "background.paper",
                                p: 2,
                            }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                direction="column"
                                rowGap={1}
                                sx={{ "& p": { textIndent: "2rem" } }}
                            >
                                <Typography
                                    color="text.primary"
                                    textAlign="justify"
                                >
                                    Score Mate is a comprehensive app designed
                                    for enthusiasts of card games who want to
                                    effortlessly keep track of scores during
                                    multiple rounds. Whether you're playing
                                    games like Poker, Bridge, Rummy, or any
                                    other card game, this app simplifies
                                    scorekeeping and enhances your gaming
                                    experience. Developed with a passion for
                                    enhancing gaming experiences, our app offers
                                    intuitive features to streamline score
                                    tracking and elevate your gameplay.
                                </Typography>

                                <Typography
                                    color="text.primary"
                                    textAlign="justify"
                                >
                                    Your feedback is invaluable in enhancing
                                    this app. Share your thoughts by clicking{" "}
                                    <Link
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSd4OQwC3TqbkbMBlkwc5OflmbiYqeg5Nq9olmdmJIjx3kOMMA/viewform?usp=sf_link"
                                        title="feedback form"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        <strong>here</strong>
                                    </Link>{" "}
                                    or reach out to me via email at{" "}
                                    <Link href="mailTo:bdekabusiness@gmail.com">
                                        <strong>bdekabusiness@gmail.com</strong>
                                    </Link>
                                    . Thank you for helping us improve.
                                </Typography>

                                <Typography
                                    color="text.primary"
                                    textAlign="justify"
                                >
                                    <strong>Developer Info:</strong> Score Mate
                                    is the passion project of me,{" "}
                                    <Link
                                        href="https://www.linkedin.com/in/biswajit-deka-a5912a177/"
                                        title="LinkedIn profile"
                                        underline="hover"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        <strong>Biswajit Deka</strong>
                                    </Link>
                                    , a solo developer driven by a love for card
                                    games and a desire to enhance the gaming
                                    experience for fellow enthusiasts.
                                </Typography>

                                <Grid item>
                                    <Divider
                                        sx={{ color: "text.primary", mt: 5 }}
                                    >
                                        Credits
                                    </Divider>

                                    <List
                                        sx={{
                                            "&.MuiList-root .MuiListItem-root":
                                                {
                                                    py: "0.125rem",
                                                },
                                        }}
                                    >
                                        <ListItem>
                                            <Link
                                                href="https://www.flaticon.com/free-icons/champion"
                                                title="champion icons"
                                            >
                                                Champion icons created by
                                                Freepik - Flaticon
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <Link
                                                href="https://www.flaticon.com/free-icons/silver-cup"
                                                title="silver cup icons"
                                            >
                                                Silver cup icons created by
                                                Freepik - Flaticon
                                            </Link>
                                        </ListItem>
                                        <ListItem>
                                            <Link
                                                href="https://www.flaticon.com/free-icons/trophy"
                                                title="trophy icons"
                                            >
                                                Trophy icons created by Freepik
                                                - Flaticon
                                            </Link>
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    <Typography color="text.primary" align="center">
                        Thank you for choosing <strong>Score Mate</strong>!
                        Happy gaming!
                    </Typography>

                    <Divider sx={{ color: "text.primary" }} />

                    <Typography
                        variant="body1"
                        color="text.primary"
                        textAlign="center"
                    >
                        &copy;{" "}
                        <Link href="/" target="_blank">
                            Score Mate
                        </Link>
                        . {new Date().getFullYear()}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default BaseLayout
