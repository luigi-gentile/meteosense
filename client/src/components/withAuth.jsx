import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import { Box, CircularProgress } from '@mui/material';

const withAuth = (WrappedComponent) => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                authenticated: false,
                loading: true,
            };
        }

        componentDidMount() {
            const token = localStorage.getItem('token');

            if (!token) {
                this.setState({ loading: false });
                return;
            }

            axios.get('/auth/verify_token', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((data) => {
                    if (data.status === 200) {
                        this.setState({ authenticated: true, loading: false });
                    } else {
                        localStorage.removeItem('token');
                        this.setState({ authenticated: false, loading: false });
                    }
                })
                .catch((err) => console.log(err));
        }

        render() {
            const { authenticated, loading } = this.state;

            if (loading) {
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                        <CircularProgress />
                        <p>Caricamento in corso...</p>
                    </Box>
                );
            }

            if (!authenticated) {
                return <Navigate to="/login" />;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withAuth;
