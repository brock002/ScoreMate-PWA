import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    useEffect,
} from "react"
import { AppContextType, Action } from "./appContext.types"
import {
    FormValues,
    CurrentGame,
    AppContextDispatchActions as DispatchActions,
} from "@/utils/types"

// players: ["JD", "SM", "SA", "BD"],
const INITIAL_FORM_VALUES = {
    players: [],
    title: "",
    maxScore: "",
    maxScorePerRound: "",
    maxRounds: "",
    reversedScoring: false,
}

const INITIAL_GAME = {
    startTime: new Date(),
    isGameRunning: false,
    scoresStr: "",
}

// creating context
const AppContext = createContext<AppContextType>({
    data: INITIAL_FORM_VALUES,
    dispatch: () => {},
})

// creating AppContext provider
const AppContextProvider: React.FC<{
    children: React.ReactNode
}> = (props) => {
    const [formValues, setFormValues] =
        useState<FormValues>(INITIAL_FORM_VALUES)
    const [currentGame, setCurrentGame] = useState<CurrentGame>(INITIAL_GAME)
    // console.log('data', formValues, currentGame)

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("currentGame") || "{}")
        // console.log('data from ls', data);
        if (!!data.formValues) setFormValues(data.formValues)
        if (!!data.currentGame) setCurrentGame(data.currentGame)
    }, [])

    useEffect(() => {
        if (currentGame.isGameRunning && !!currentGame.scoresStr)
            localStorage.setItem(
                "currentGame",
                JSON.stringify({ formValues, currentGame })
            )
    }, [currentGame])

    // creating dispatch
    const dispatch = useCallback((action: Action) => {
        switch (action.type) {
            case DispatchActions.updateValue:
                const { name, value } = action.payload || {}
                if (
                    name === "title" ||
                    name === "players" ||
                    name === "maxScore" ||
                    name === "maxRounds" ||
                    name === "maxScorePerRound" ||
                    name === "reversedScoring"
                )
                    setFormValues((prev) => ({ ...prev, [name]: value }))
                break
            case DispatchActions.startGame:
                setCurrentGame({
                    startTime: new Date(),
                    isGameRunning: true,
                    scoresStr: "",
                })
                break
            case DispatchActions.updateCurrentGameScores:
                const { scores } = action.payload || {}
                setCurrentGame((prev) => ({
                    ...prev,
                    scoresStr: JSON.stringify(scores),
                }))
                break
            case DispatchActions.finishGame:
                setFormValues((prev) => ({
                    ...INITIAL_FORM_VALUES,
                    players: prev.players,
                }))
                setCurrentGame(INITIAL_GAME)
                localStorage.removeItem("currentGame")
                break
            default:
                throw new Error(`Unhandled action type: ${action.type}`)
        }
    }, [])

    // creating value for context
    const value = {
        data: formValues,
        currentGameData: currentGame,
        dispatch,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

// creating custom hook to use form data
const useFormData = () => {
    const context = useContext(AppContext)
    if (context === undefined || !Object.keys(context).length)
        throw new Error("useFormData must be used within a AppContextProvider")

    return context
}

export default useFormData
export { AppContextProvider }
