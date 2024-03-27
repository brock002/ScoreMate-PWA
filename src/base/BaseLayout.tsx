import { Outlet } from "react-router-dom"
import { Grid, IconButton, Typography } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useColorModes } from "@/contexts"

const BaseLayout = () => {
    const { colorMode, toggleColorMode } = useColorModes()

    return (
        <Grid
            container
            component="main"
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
                        mx: -2,
                    })}
                >
                    <Typography
                        variant="h1"
                        sx={{ fontSize: { xs: 24, sm: 30 }, ml: 1.5 }}
                        color="text.primary"
                    >
                        CardScore Tracker
                    </Typography>
                    <IconButton
                        sx={{ m: 1 }}
                        onClick={toggleColorMode}
                        color="inherit"
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
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default BaseLayout
