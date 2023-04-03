import { useState } from "react";
import { Box, TextField, Button, Avatar, Typography, Link, CircularProgress } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm: "",
        errors: {
            email: "",
            password: "",
            confirm: ""
        },
    });

    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            errors: {
                ...formData.errors,
                [e.target.name]: e.target.value.trim() === "" ? "Campo obbligatorio" : "",
            },
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirm } = formData;
        const errors = {
            email: email.trim() === "" ? "Campo obbligatorio" : "",
            password: password.trim() === "" ? "Campo obbligatorio" : "",
            confirm: confirm.trim() === "" ? "Campo obbligatorio" : "",
        };
        if (errors.email !== "" || errors.password !== "" || errors.confirm !== "") {
            setFormData({ ...formData, errors });
        } else {
            if (password !== confirm) {
                setPasswordError(true);
                setFormData({
                    ...formData,
                    password: "",
                    confirm: "",
                });
            } else {
                setPasswordError(false);
                try {
                    setLoading(true);
                    await axios.post("/auth/register", formData);
                    toast.success("Registrazione avvenuta con successo!");
                } catch (error) {
                    console.log(error.response.data);
                    toast.error(`${error.response.data.message}`);
                } finally {
                    setLoading(false);
                }
            }

        }
    };

    const { email, password, confirm, errors } = formData;

    return (
        <Box sx={{
            maxWidth: 400,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mt: '15%' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" sx={{ my: '2%' }}>
                Registrazione
            </Typography>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    fullWidth
                    error={errors.email !== ""}
                    helperText={errors.email}
                />
                <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    fullWidth
                    error={errors.password !== ""}
                    helperText={errors.password}
                />
                <TextField
                    id="confirm"
                    name="confirm"
                    label="Conferma password"
                    type="password"
                    value={confirm}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    fullWidth
                    error={errors.confirm !== ""}
                    helperText={errors.confirm}
                />
                {passwordError && (
                    <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                        Le password non corrispondono!
                    </Typography>
                )}
                <Box sx={{ textAlign: 'right' }}>
                    <Link variant="body2" href="/login">Hai già un account? Accedi</Link>
                </Box>

                <Button type="submit" variant="contained" fullWidth sx={{ my: '5%' }}>
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Registrati'
                    )}
                </Button>
            </form>
            <ToastContainer style={{ top: 70 }} />
        </Box>
    );
};

export default RegistrationForm;



