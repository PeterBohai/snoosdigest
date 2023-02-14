import React, { useState } from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

import RedditHome from "../components/RedditHome";
import HackernewsHome from "../components/HackernewsHome";
import { Link, Typography } from "@mui/material";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function tabProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
        sx: {
            py: 1.2,
            px: 2.8,
            minHeight: "32px",
            fontWeight: "bold",
            fontSize: "inherit",
        },
    };
}

function HomeScreen() {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

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
                        <Tab label="Reddit" {...tabProps(0)} />

                        <Tab
                            component={Link}
                            to={"/login"}
                            label={
                                <Typography>
                                    Hacker News
                                    <Chip label="beta" size="small" sx={{ ml: 0.5 }} />
                                </Typography>
                            }
                            {...tabProps(1)}
                        />
                    </Tabs>
                </Container>
            </Box>
            <Container sx={container_breakpoints}>
                <TabPanel value={tabValue} index={0}>
                    <RedditHome />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <HackernewsHome />
                </TabPanel>
            </Container>
        </Box>
    );
}

export default HomeScreen;
