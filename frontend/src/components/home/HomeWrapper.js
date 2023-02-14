import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

import { Typography } from "@mui/material";

function TabPanel({ children, value, panelName, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== panelName}
            id={`simple-tabpanel-${panelName}`}
            aria-labelledby={`simple-tab-${panelName}`}
            {...other}
        >
            {value === panelName && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function tabProps(value) {
    return {
        id: `simple-tab-${value}`,
        "aria-controls": `simple-tabpanel-${value}`,
        sx: {
            py: 1.2,
            px: 2.8,
            minHeight: "32px",
            fontWeight: "bold",
            fontSize: "inherit",
        },
    };
}

export default function HomeWrapper({ tabName, children }) {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(tabName);
    console.log(tabName);
    console.log(tabValue);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const container_breakpoints = {
        [theme.breakpoints.down("lg")]: {
            maxWidth: "sm",
        },
        [theme.breakpoints.up("lg")]: {
            maxWidth: "md",
        },
    };

    return (
        <Box>
            <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                <Container sx={container_breakpoints}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        aria-label="App Tabs"
                        centered
                        sx={{
                            minHeight: "32px",
                            fontSize: theme.typography.subtitle1.fontSize,
                        }}
                        TabIndicatorProps={{
                            sx: {
                                bgcolor:
                                    tabValue === 1
                                        ? theme.palette.app.hackernews
                                        : theme.palette.app.reddit,
                            },
                        }}
                        textColor="inherit"
                    >
                        <Tab
                            value="reddit"
                            component={RouterLink}
                            to={"/"}
                            label="Reddit"
                            {...tabProps("reddit")}
                        />

                        <Tab
                            value="hackernews"
                            component={RouterLink}
                            to={"/hackernews"}
                            label={
                                <Typography component="div" sx={{ fontWeight: "bold" }}>
                                    Hacker News
                                    <Chip
                                        label="beta"
                                        size="small"
                                        sx={{ ml: 0.5, fontWeight: "normal" }}
                                    />
                                </Typography>
                            }
                            {...tabProps("hackernews")}
                        />
                    </Tabs>
                </Container>
            </Box>
            <Container sx={container_breakpoints}>
                <TabPanel value={tabValue} panelName={tabName}>
                    {children}
                </TabPanel>
            </Container>
        </Box>
    );
}
