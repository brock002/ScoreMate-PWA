import React from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const MuiTransition = React.forwardRef((
    props: TransitionProps & {
        direction?: "up" | "down" | "left" | "right",
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) =>
    <Slide ref={ref}  {...props} />
)

MuiTransition.defaultProps = { direction: 'up' }

export default MuiTransition
