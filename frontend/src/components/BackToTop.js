import React from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";

export default function BackToTop({ children }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 200,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            "#back-to-top-anchor"
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: "center",
            });
        }
    };

    return (
        <Slide in={trigger} direction="up" style={{ transitionDuration: "150ms" }}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: { xs: 32, md: "10%", lg: "15%", xl: "18%" },
                }}
            >
                {children}
            </Box>
        </Slide>
    );
}
