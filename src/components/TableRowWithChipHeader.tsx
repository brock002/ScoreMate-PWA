import React from "react"
import {
    Chip,
    ChipProps,
    Divider,
    TableCell,
    TableRow,
    TableRowProps,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

type TableRowWithChipHeader = {
    columnsCount: number
    header: string
    onClick?: () => void
    onDelete?: () => void
} & TableRowProps

const TableRowWithChipHeader: React.FC<TableRowWithChipHeader> = (props) => {
    const { children, columnsCount, header, onClick, onDelete, ...rest } = props
    // define chip props
    const chipProps: ChipProps = {
        variant: "outlined",
        label: header,
        size: "small",
    }
    if (onclick) chipProps.onClick = onClick
    if (onDelete) chipProps.onDelete = onDelete

    return (
        <React.Fragment>
            <TableRow>
                <TableCell
                    sx={{
                        padding: "1rem 0 0",
                        borderBottom: "none",
                    }}
                    colSpan={columnsCount}
                >
                    <Divider
                        sx={{
                            "&.MuiDivider-root::before": {
                                width: "22%",
                            },
                        }}
                    >
                        <Chip
                            {...chipProps}
                            sx={(theme) => ({
                                border: `1px solid ${theme.palette.divider}`,
                                ".MuiChip-label": chipProps.onDelete
                                    ? { marginRight: 0.75 }
                                    : {},
                                ".MuiChip-deleteIcon": {
                                    color: theme.palette.error.light,
                                },
                            })}
                            deleteIcon={
                                <DeleteIcon
                                    sx={(theme) => ({
                                        pl: "1px",
                                        borderLeft: `1.5px solid ${theme.palette.divider}`,
                                    })}
                                />
                            }
                        />
                    </Divider>
                </TableCell>
            </TableRow>
            {children && <TableRow {...rest}>{children}</TableRow>}
        </React.Fragment>
    )
}
TableRowWithChipHeader.defaultProps = {
    onClick: () => {},
}

export default TableRowWithChipHeader
