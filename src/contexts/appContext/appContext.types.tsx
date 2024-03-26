import {
    AppContextDispatchActions,
    CurrentGame,
    FormValues,
} from "src/utils/types"

export type Action = {
    type: AppContextDispatchActions
    payload?: { [key: string]: unknown }
}

type DispatchType = (action: Action) => void

export type AppContextType = {
    data: FormValues
    currentGameData?: CurrentGame
    dispatch: DispatchType
}
