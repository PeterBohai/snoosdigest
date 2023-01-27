import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import apiService from "../services/api";

function AutoComplete({ id, onChange, error, helperText }) {
    const [options, setOptions] = React.useState([]);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        apiService.getSubredditOptions().then((res) => {
            setOptions(res.data);
            console.info(res.data);
        });
    }, []);

    const handleOpen = () => {
        if (inputValue.length > 1) {
            setOpen(true);
        }
    };

    const handleInputChange = (_event, newInputValue) => {
        setInputValue(newInputValue);
        onChange(newInputValue);
        if (newInputValue.length > 1) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    return (
        <Autocomplete
            freeSolo
            inputValue={inputValue}
            onInputChange={handleInputChange}
            open={open}
            onOpen={handleOpen}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) => (option.display_name ? option.display_name : option)}
            renderInput={(params) => (
                <TextField
                    id={id}
                    {...params}
                    autoFocus
                    label="Subreddit name"
                    margin="dense"
                    variant="standard"
                    error={error}
                    helperText={helperText}
                />
            )}
            renderOption={(props, option, { inputValue }) => {
                const matches = [];
                const inputValueIndex = option.display_name
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase());
                if (inputValueIndex !== -1) {
                    matches.push([inputValueIndex, inputValueIndex + inputValue.length]);
                }

                const parts = parse(option.display_name, matches);

                return (
                    <li {...props}>
                        <div>
                            {parts.map((part, index) => (
                                <Box
                                    component="span"
                                    key={index}
                                    sx={{
                                        fontWeight: part.highlight ? 400 : 400,
                                        color: part.highlight ? "secondary.main" : "inherit",
                                    }}
                                >
                                    {part.text}
                                </Box>
                            ))}
                        </div>
                    </li>
                );
            }}
        />
    );
}

export default AutoComplete;
