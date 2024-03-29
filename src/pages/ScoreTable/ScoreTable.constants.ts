export const CONFIRMATION_DIALOG_INITIAL_PROPS = {
    title: "Confirm",
    content: "",
    handleConfirm: () => {},
}

export const CONFIRMATION_DIALOG_PROPS = {
    confirmReset: {
        title: "Confirm Reset",
        content:
            "If you confirm, the scores will reset. Are you sure you want to reset the game?",
    },
    confirmDeleteRound: {
        title: "Confirm Delete",
        content:
            "If you confirm, the scores for this round will be deleted. Are you sure you want to delete this round?",
    },
}
