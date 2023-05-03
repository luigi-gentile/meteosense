import Navbar from "../components/Navbar";
import withAuth from "../components/withAuth";
import Map from "../components/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import SensorSelector from "../components/SensorSelector";
import { Box, Grid, Typography } from "@mui/material";

const Home = () => {
    const [sensorsData, setSensorsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/sensors/data');
                setSensorsData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <Typography variant='h6' gutterBottom sx={{ mt: "2%", ml: "3%", mb: "1%" }}>
                Mappa dei sensori disponibili
            </Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'left',
                flexDirection: 'row',
                alignItems: 'left',
                ml: "3%"
            }}>
                <Grid container spacing={1} style={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Grid item xs={12} sm={7}>
                        <Map data={sensorsData} />
                    </Grid>
                    <Grid item xs={12} sm={5} >
                        <Box sx={{ maxWidth: 550, mx: 'auto' }}>
                            <SensorSelector data={sensorsData} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default withAuth(Home);