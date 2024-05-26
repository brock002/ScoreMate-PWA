import { useMemo } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { wrapWithColorModeContext } from "@/contexts/colorModeContext/colorModeContext"
import { AppContextProvider } from "@/contexts/appContext/appContext"
import { useColorModes } from "@/contexts"
import { ScoreTable, GameForm } from "@/pages"
import { SnackbarProvider } from "notistack"
import { ThemeProvider } from "@mui/material"
import { createTheme } from "@mui/material/styles"
import { lightTheme, darkTheme } from "@/themes"
import BaseLayout from "./BaseLayout"

function App() {
    const { colorMode } = useColorModes()

    // creating router
    const router = createBrowserRouter([
        {
            path: "/",
            element: <BaseLayout />,
            children: [
                {
                    index: true,
                    element: <GameForm />,
                },
                {
                    path: "/table",
                    element: <ScoreTable />,
                },
            ],
        },
    ])

    // creating theme
    const theme = useMemo(
        () =>
            colorMode === "light"
                ? createTheme(lightTheme)
                : createTheme(darkTheme),
        [colorMode]
    )

    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            preventDuplicate
        >
            <ThemeProvider theme={theme}>
                <AppContextProvider>
                    <RouterProvider router={router} />
                </AppContextProvider>
            </ThemeProvider>
        </SnackbarProvider>
    )
}

export default wrapWithColorModeContext(App)
