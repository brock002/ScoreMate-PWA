import { ThemeOptions } from "@mui/material/styles"

const darkTheme: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: "#972d07",
        },
        secondary: {
            main: "#757083",
        },
        background: {
            paper: "#282829",
            default: "#0e0004",
        },
        text: {
            primary: "rgba(255,255,255,0.87)",
            secondary: "rgba(255,255,255,0.6)",
            disabled: "rgba(255,255,255,0.38)",
        },
    },
}

export default darkTheme
