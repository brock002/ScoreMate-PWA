import { Slide, SlideProps, Snackbar } from '@mui/material'
import React, { createContext, useContext, useState } from 'react'
import { SnackbarStateType, SnackbarContextType } from './snackbarContext.types'


// BROKEN
// DO NOT USE


// creating context
const SnackbarContext = createContext<SnackbarContextType>({
	enqueueSnackbar: () => { },
	closeSnackbar: () => { },
})

// defining transition component for snackbar
const SlideTransition = (props: SlideProps) => (
	<Slide {...props} direction='up' />
)

// defining initial state for snackbar state
const INITIAL_STATE = {
	message: '',
	autoHideDuration: 5000,
}

// creating context provider
const SnackbarContextProvider: React.FC<{
	children: React.ReactNode
}> = (props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [state, setState] = useState<SnackbarStateType>()
	const [currentSnackBarIndex, setCurrentSnackBarIndex] = useState(0)

	// defining function to show snackbar
	const enqueueSnackbar = (props: SnackbarStateType) => {
		setCurrentSnackBarIndex((prev) => prev + 1)
		setIsOpen(true)
		setState(props)
	}

	// defining function to hide snackbar
	const handleClose = () => {
		setIsOpen(false)
		// setState(INITIAL_STATE)
	}

	// creating value for context
	const value = {
		enqueueSnackbar,
		closeSnackbar: handleClose,
	}

	return (
		<SnackbarContext.Provider value={value}>
			{props.children}
			<Snackbar
				open={isOpen}
				onClose={handleClose}
				TransitionComponent={SlideTransition}
				{...state}
				key={`open-snackbar-item-${currentSnackBarIndex}`}
			// key={state.Transition.name}
			/>
		</SnackbarContext.Provider>
	)
}

// creating custom hook to use snackbar
const useSnackbar = () => {
	const context = useContext(SnackbarContext)
	if (context === undefined || !Object.keys(context).length)
		throw new Error('useSnackbar must be used within a SnackbarContext')

	return context
}

export { SnackbarContextProvider }
export default useSnackbar
