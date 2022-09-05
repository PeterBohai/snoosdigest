import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material/styles";

function ScrollToUpdate({ openSideDrawer, ...restProps }) {
    const theme = useTheme();
    const {
        threshold,
        bgColorBefore,
        bgColorAfter,
        textColorBefore,
        textColorAfter,
        fadeIn,
        fadeOut,
        children,
        ...other
    } = {
        threshold: 10,
        bgColorBefore: theme.palette.background.default,
        bgColorAfter: theme.palette.background.default,
        textColorBefore: theme.palette.text.primary,
        textColorAfter: theme.palette.text.primary,
        fadeIn: "0.2s ease-in",
        fadeOut: "0.2s ease-out",
        ...restProps,
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: threshold,
        target: restProps.window ? window() : undefined,
    });

    return React.cloneElement(children, {
        style: {
            boxShadow: trigger || openSideDrawer ? "1px 1px 8px #888888" : "none",
            backgroundColor: trigger ? bgColorAfter : bgColorBefore,
            color: trigger ? textColorAfter : textColorBefore,
            transition: trigger ? fadeIn : fadeOut,
            // paddingTop: trigger ? paddingAfter : paddingBefore,
            // paddingBottom: trigger ? paddingAfter : paddingBefore,
        },
        ...other,
    });
}

export default ScrollToUpdate;
