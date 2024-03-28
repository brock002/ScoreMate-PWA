export type FormValues = {
    players: string[]
    title: string
    maxScore: number | string
    maxScorePerRound: number | string
    maxRounds: number | string
    reversedScoring: boolean
}

export type CurrentGame = {
    isGameRunning: boolean
    scoresStr: string
    startTime: Date
}

export enum AppContextDispatchActions {
    "finishGame",
    "startGame",
    "updateValue",
    "updateCurrentGameScores",
}
