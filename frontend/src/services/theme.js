import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Link } from "@mui/material";
import { grey, common } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const getTheme = (mode) => {
    let theme = createTheme(baseTheme(mode));
    theme = createTheme(theme, {
        components: {
            MuiSkeleton: {
                defaultProps: {
                    animation: "wave",
                },
                styleOverrides: {
                    root: {
                        backgroundColor: theme.palette.footer.main,
                    },
                    rounded: {
                        borderRadius: 7,
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        paddingTop: 5,
                        paddingBottom: 5,
                    },
                },
            },
        },
    });
    theme = responsiveFontSizes(theme, {
        breakpoints: ["mobile", "sm", "md", "lg"],
        factor: 2,
    });
    return theme;
};

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
    breakpoints: {
        values: {
            mobile: 480,
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

// Base Theme designed with https://bareynol.github.io/mui-theme-creator/
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
    footer: {
        main: grey[50],
        secondary: grey[200],
    },
    background: {
        lighter: common.white,
        light: common.white,
    },
};

const baseDarkModePalette = {
    primary: {
        main: "#1675E2",
    },
    secondary: {
        main: "#f50057",
    },
    info: {
        main: "#2196f3",
    },
    discrete: {
        main: grey[500],
    },
    footer: {
        main: "#121212",
        secondary: grey[800],
    },
    text: {
        primary: grey[300],
    },
    background: {
        lighter: grey[900],
        light: "#2B2B2B",
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
        a: {
            component: Link,
            props: {
                target: "_blank",
            },
        },
    },
};

const exportedThemeConfigs = {
    markdownBaseOptions,
    getTheme,
};

export default exportedThemeConfigs;
