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
                        backgroundColor: theme.palette.componentSkeleton.main,
                    },
                    rounded: {
                        borderRadius: 5,
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
        palette: {
            app: {
                reddit: theme.palette.primary.main,
                hackernews: theme.palette.warning.main,
            },
        },
        typography: {
            preview_title: {
                fontWeight: 700,
                lineHeight: theme.typography.h4.lineHeight,
                letterSpacing: theme.typography.h4.letterSpacing,
                [theme.breakpoints.up("xs")]: {
                    fontSize: "1.12rem",
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.15rem",
                },
                [theme.breakpoints.up("md")]: {
                    fontSize: "1.25rem",
                },
                [theme.breakpoints.up("lg")]: {
                    fontSize: "1.42rem",
                },
            },
            preview_body: {
                [theme.breakpoints.up("xs")]: {
                    fontSize: theme.typography.body2.fontSize,
                    lineHeight: "1.2",
                    letterSpacing: theme.typography.body2.letterSpacing,
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "0.9rem",
                    lineHeight: "1.3",
                    letterSpacing: theme.typography.body1.letterSpacing,
                },
                [theme.breakpoints.up("md")]: {
                    fontSize: "0.95rem",
                    lineHeight: "1.35",
                    letterSpacing: theme.typography.body1.letterSpacing,
                },
                [theme.breakpoints.up("lg")]: {
                    fontSize: theme.typography.body1.fontSize,
                    lineHeight: "1.4",
                    letterSpacing: theme.typography.body1.letterSpacing,
                },
            },
            md_body: {
                [theme.breakpoints.up("xs")]: {
                    fontSize: "0.97rem",
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.15rem",
                },
            },
            md_h1: {
                [theme.breakpoints.up("xs")]: {
                    fontSize: "1.4rem",
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.7rem",
                },
                fontWeight: 500,
                marginBottom: "0.5rem",
            },
            md_h2: {
                [theme.breakpoints.up("xs")]: {
                    fontSize: "1.25rem",
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.6rem",
                },
                fontWeight: 400,
            },
            md_h3: {
                [theme.breakpoints.up("xs")]: {
                    fontSize: "1.15rem",
                },
                [theme.breakpoints.up("sm")]: {
                    fontSize: "1.4rem",
                },
                fontWeight: 400,
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
            fontSize: "1.9rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.7rem",
            fontWeight: 400,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 700,
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
        main: common.white,
        secondary: grey[200],
    },
    componentSkeleton: {
        main: grey[200],
    },
    background: {
        lighter: common.white,
        light: common.white,
        default: grey[50],
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
    componentSkeleton: {
        main: grey[900],
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
                component: "p",
                variant: "md_body",
                sx: {
                    mb: 1.5,
                },
            },
        },
        p: {
            component: Typography,
            props: {
                component: "p",
                variant: "md_body",
                sx: {
                    mb: 1.5,
                },
            },
        },
        li: {
            component: Typography,
            props: {
                component: "li",
                variant: "md_body",
            },
        },
        h1: {
            component: Typography,
            props: {
                variant: "md_h1",
                component: "h2",
            },
        },
        h2: {
            component: Typography,
            props: {
                variant: "md_h2",
                component: "h3",
            },
        },
        h3: {
            component: Typography,
            props: {
                variant: "md_h3",
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
