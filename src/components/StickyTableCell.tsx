import { TableCell } from "@mui/material"
import { styled } from "@mui/system"

const StickyTableCell = styled(TableCell)(({ theme }) => ({
    zIndex: "2",
    position: "sticky",
    backgroundColor: theme.palette.background.paper,
}))

export default StickyTableCell
