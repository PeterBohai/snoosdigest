import React from "react";
import Chip from "@mui/material/Chip";

export default function SmallBadge({ badgeText, sx, color = "default" }) {
    return (
        <Chip
            label={badgeText}
            size="small"
            color={color}
            sx={{
                fontWeight: "normal",
                height: "inherit",
                borderRadius: "8px",
                fontSize: "0.8rem",
                ...sx,
            }}
        />
    );
}
