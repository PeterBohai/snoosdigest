import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";

function ScrollToUpdate(props) {
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
        bgColorBefore: "white",
        bgColorAfter: "white",
        textColorBefore: "black",
        textColorAfter: "black",
        fadeIn: "0.2s ease-in",
        fadeOut: "0.2s ease-out",
        ...props,
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: threshold,
        target: props.window ? window() : undefined,
    });

    return React.cloneElement(children, {
        style: {
            boxShadow: trigger || props.openSideDrawer ? "1px 1px 8px #888888" : "none",
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
