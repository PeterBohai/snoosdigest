import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { grey } from "@mui/material/colors";

// Base Theme designed with https://bareynol.github.io/mui-theme-creator/
const baseTheme = (mode) => ({
    palette: {
        mode,
        ...(mode === "light" ? baseLightModePalette : baseDarkModePalette),
    },
    typography: {
        button: {
            textTransform: "none", // Remove button text all caps
        },
        h2: {
            fontSize: "2.3rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "2.125rem",
            fontWeight: 400,
        },
        h4: {
            fontSize: "1.6rem",
            fontWeight: 600,
        },
    },
    components: {
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
            styleOverrides: {
                root: {
                    backgroundColor: grey[50],
                },
                rounded: {
                    borderRadius: 7,
                },
            },
        },
    },
});

const baseLightModePalette = {
    primary: {
        main: "#1565c0",
    },
    secondary: {
        main: "#f50057",
    },
    info: {
        main: "#2196f3",
    },
    discrete: {
        main: grey[600],
    },
};

const baseDarkModePalette = {
    primary: {
        main: "#1565c0",
    },
    secondary: {
        main: "#f50057",
    },
    info: {
        main: "#2196f3",
    },
    discrete: {
        main: grey[600],
    },
};

const markdownBaseOptions = {
    overrides: {
        span: {
            component: Typography,
            props: {
                sx: {
                    mb: 1.5,
                },
            },
        },
        p: {
            component: Typography,
            props: {
                component: "p",
                sx: {
                    mb: 1.5,
                },
            },
        },
        h1: {
            component: Typography,
            props: {
                variant: "h4",
                component: "h2",
            },
        },
        h2: {
            component: Typography,
            props: {
                variant: "h5",
                component: "h3",
            },
        },
        h3: {
            component: Typography,
            props: {
                variant: "h6",
                component: "h4",
            },
        },
        table: {
            component: Table,
            props: {
                size: "small",
            },
        },
        thead: {
            component: TableHead,
        },
        tr: {
            component: TableRow,
        },
        th: {
            component: TableCell,
            props: {
                style: {},
                align: "left",
            },
        },
        tbody: {
            component: TableBody,
        },
        td: {
            component: TableCell,
            props: {
                style: {},
                align: "left",
            },
        },
        blockquote: {
            props: {
                className: "markdown",
            },
        },
    },
};

const MAX_SUBSCRIPTIONS_NUM_PER_USER = 10;

const exportedConfigs = {
    markdownBaseOptions,
    baseTheme,
    MAX_SUBSCRIPTIONS_NUM_PER_USER,
};

export default exportedConfigs;
