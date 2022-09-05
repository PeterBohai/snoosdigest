import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material/styles";

function ScrollToUpdate({ openSideDrawer, ...restProps }) {
    const theme = useTheme();
    const {
        threshold,
        bgColorBefore,
        bgColorAfterDark,
        textColorBefore,
        textColorAfter,
        fadeIn,
        fadeOut,
        children,
        ...other
    } = {
        threshold: 10,
        bgColorBefore: theme.palette.background.default,
        bgColorAfterDark: theme.palette.grey[900],
        textColorBefore: theme.palette.text.primary,
        textColorAfter: theme.palette.text.primary,
        fadeIn: "box-shadow 0.25s ease-in",
        fadeOut: "box-shadow 0.25s ease-out",
        ...restProps,
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: threshold,
        target: restProps.window ? window() : undefined,
    });

    return React.cloneElement(children, {
        style: {
            boxShadow: trigger || openSideDrawer ? theme.shadows[4] : "none",
            backgroundColor:
                theme.palette.mode === "light"
                    ? bgColorBefore
                    : trigger
                    ? bgColorAfterDark
                    : bgColorBefore,
            color: trigger ? textColorAfter : textColorBefore,
            transition: trigger ? fadeIn : fadeOut,
            // paddingTop: trigger ? paddingAfter : paddingBefore,
            // paddingBottom: trigger ? paddingAfter : paddingBefore,
        },
        ...other,
    });
}

export default ScrollToUpdate;
