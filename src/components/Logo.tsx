import { Grid, GridProps, Typography, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import LogoIcon from "@/assets/logo-icon.png"

const Logo: React.FC<GridProps> = (props) => {
    const theme = useTheme()
    const isUpSM = useMediaQuery(theme.breakpoints.up("sm"))
    return (
        <Grid container alignItems="center" {...props}>
            <img
                src={LogoIcon}
                alt="LOGO"
                height={isUpSM ? 36 : 24}
                width={isUpSM ? 36 : 24}
            />
            <Typography
                variant="h1"
                sx={{ fontSize: { xs: 24, sm: 30 }, ml: 1 }}
                color="text.primary"
            >
                Score Mate
            </Typography>
        </Grid>
    )
}

export default Logo
