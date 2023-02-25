import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
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
            {value === panelName && <Box sx={{ py: { xs: 2, md: 3 } }}>{children}</Box>}
        </div>
    );
}

function tabProps(value) {
    return {
        id: `simple-tab-${value}`,
        "aria-controls": `simple-tabpanel-${value}`,
        sx: {
            pt: 0.5,
            pb: 0.5,
            px: 1.5,
            minHeight: "32px",
            fontWeight: "bold",
        },
    };
}

export default function HomeWrapper({ tabName, children }) {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(tabName);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const container_breakpoints = {
        [theme.breakpoints.up("xs")]: {
            maxWidth: "sm",
        },
        [theme.breakpoints.up("md")]: {
            maxWidth: "750px",
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
                            label={
                                <Typography variant="tab_label" component="div">
                                    Reddit
                                </Typography>
                            }
                            {...tabProps("reddit")}
                        />

                        <Tab
                            value="hackernews"
                            component={RouterLink}
                            to={"/hackernews?sort_type=best"}
                            label={
                                <Typography variant="tab_label" component="div">
                                    Hacker News
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
