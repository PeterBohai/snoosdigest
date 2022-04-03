import React from 'react';
import { Link as RouterLink} from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';


function Header() {
    return (
        <header>
            <AppBar position='static' color='error'>
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>
                    <Link component={RouterLink} to='/' underline='none' color='inherit'>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                            Snoos Digest
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
        </header>
    );
}

export default Header;
