import { createContext, useState, useContext, useEffect } from "react"
import { ColorModeContextType } from "./colorModeContext.types"

// creating context
const ColorModeContext = createContext<ColorModeContextType>({
    colorMode: "dark",
    toggleColorMode: () => {},
})

// creating context wrapper
const wrapWithColorModeContext = (Component: React.FC) => (props: any) => {
    const [mode, setMode] = useState<"light" | "dark">("dark")

    useEffect(() => {
        // getting mode from local storage if available
        const lsMode = localStorage.getItem("theme") || "{}"
        if (lsMode === "light" || lsMode === "dark") setMode(lsMode)
    }, [])

    // function to toggle color mode
    const toggleColorMode = () =>
        setMode((prev) => {
            const newMode = prev === "light" ? "dark" : "light"
            // setting new mode in local storage
            localStorage.setItem("theme", newMode)
            return newMode
        })

    // creating value for context
    const value = {
        colorMode: mode,
        toggleColorMode,
    }

    return (
        <ColorModeContext.Provider value={value}>
            <Component {...props} />
        </ColorModeContext.Provider>
    )
}

// creating custom hook to use this context
const useColorModes = () => {
    const context = useContext(ColorModeContext)
    if (context === undefined || !Object.keys(context).length)
        throw new Error(
            "useColorModes must be used within a ColorModeContextProvider"
        )

    return context
}

export default useColorModes
export { wrapWithColorModeContext }
