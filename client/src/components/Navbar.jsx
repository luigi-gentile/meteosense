import React from 'react';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../images/logostrettosenzasfondo1.png'

const StyledIconButton = styled(IconButton)({
    '& img': {
        width: 280,
        height: 55,
        borderRadius: 5
    },
});

function Navbar() {

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload();
        <Navigate to="/login" />
    }

    return (
        <AppBar position="static" >
            <Toolbar>
                <StyledIconButton href='/' edge="start" color="inherit" aria-label="menu">
                    <img alt="logo" src={logo} />
                </StyledIconButton>
                <div style={{ flexGrow: 1 }} />
                {!localStorage.getItem('token') ?
                    <>
                        <Button href='/login' color='secondary' variant='contained' sx={{ mr: "1%" }}>Accedi</Button>
                        <Button href='/registration' variant='contained' color='secondary'>Registrati</Button>
                    </> :
                    <>
                        <Button href='/login' color="secondary" variant='contained' onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm('Sei sicuro di voler uscire?')) {
                                logout();
                            }
                        }}>
                            <LogoutIcon sx={{ mr: .7 }} />
                            Logout
                        </Button>
                    </>
                }
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
