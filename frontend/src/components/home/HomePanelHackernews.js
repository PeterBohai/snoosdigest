import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { getHackernewsPosts } from "../../services/hackernews";
import PostPreviewCard from "../PostPreviewCard";

function HackernewsHome() {
    const [posts, setPosts] = useState([]);
    const [apiError, setApiError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setPosts([]);
        getHackernewsPosts(searchParams.get("sort_type") || "best")
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => {
                if (err.response) {
                    const error = err.response;
                    console.error(`${error.status} Response - ${JSON.stringify(error.data)}`);
                    setApiError(error.data);
                } else if (err.request) {
                    console.error(`Request made but got no response. Request - ${err.request}`);
                    setApiError("Something is wrong, could not get response.");
                } else {
                    console.error(`There was an issue with the request - ${err.message}`);
                    setApiError("Something is wrong with the request.");
                }
            });
    }, [searchParams]);

    if (apiError) return null;

    const handleSortTypeChange = (event) => {
        setSearchParams({ sort_type: event.target.value });
    };

    return (
        <Box>
            <Box sx={{ maxWidth: 120 }}>
                <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
                    <InputLabel id="sort-type-select-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-type-select-label"
                        id="sort-type-select"
                        value={searchParams.get("sort_type") || "best"}
                        label="Sort By"
                        defaultValue={searchParams.get("sort_type") || "best"}
                        onChange={handleSortTypeChange}
                        sx={{
                            borderWidth: "2px",
                            "& #sort-type-select": {
                                py: 0.7,
                            },
                        }}
                    >
                        <MenuItem value={"best"}>Best</MenuItem>
                        <MenuItem value={"top"}>Top</MenuItem>
                        <MenuItem value={"ask"}>Ask</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Stack spacing={0}>
                {(posts.length === 0 ? [...Array(5)] : posts).map((post, index) =>
                    post ? (
                        <PostPreviewCard postDetail={post} key={index} />
                    ) : (
                        <Skeleton variant="rounded" height={130} key={index} sx={{ mt: 4 }} />
                    )
                )}
            </Stack>
        </Box>
    );
}

export default HackernewsHome;
