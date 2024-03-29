import { Outlet } from "react-router-dom"
import { Grid, IconButton, Typography, useMediaQuery } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useTheme } from "@mui/material/styles"
import Logo from "@/assets/logo-icon.png"
import { useColorModes } from "@/contexts"

const BaseLayout = () => {
    const { colorMode, toggleColorMode } = useColorModes()
    const theme = useTheme()
    const isUpSM = useMediaQuery(theme.breakpoints.up("sm"))

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
                    <Grid
                        item
                        container
                        alignItems="center"
                        xs={8}
                        sm={6}
                        ml={{ xs: 0.25, sm: 1.5 }}
                    >
                        <img
                            src={Logo}
                            alt="LOGO"
                            height={isUpSM ? 36 : 24}
                            width={isUpSM ? 36 : 24}
                        />
                        <Typography
                            variant="h1"
                            sx={{ fontSize: { xs: 24, sm: 30 }, ml: 1 }}
                            color="text.primary"
                        >
                            Score Mate
                        </Typography>
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
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default BaseLayout
