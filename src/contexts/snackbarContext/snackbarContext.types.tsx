export type SnackbarStateType = {
	message: string
	key: string
	autoHideDuration?: number
}

export type EnqueueSnackbarFuncProps = {
	message: string
	autoHideDuration?: number
}

export type SnackbarContextType = {
	enqueueSnackbar: (props: SnackbarStateType) => void
	closeSnackbar: () => void
}
