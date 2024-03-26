import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

type ConfirmationDialogProps = {
    open: boolean,
    title: string,
    actions: { label: string, handleClick: () => void, }[]
    content?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, title, actions, content }) => {
    return (
        <Dialog
            open={open}
            keepMounted
            maxWidth="xs"
            aria-describedby='confirmation-dialog-desc'
            disableEscapeKeyDown
            fullWidth
        >
            <DialogTitle variant='h5'>{title}</DialogTitle>
            {content &&
                <DialogContent>
                    <Typography variant='subtitle2'>Note: {content}</Typography>
                </DialogContent>
            }
            <DialogActions>
                {actions.map((item, index) =>
                    <Button
                        key={`confirmation-dialog-actions-${index}`}
                        size='small'
                        variant='contained'
                        color='primary'
                        onClick={item.handleClick}>
                        {item.label}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog