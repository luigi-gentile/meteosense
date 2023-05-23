import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, CircularProgress, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, Fade, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import SensorChart from './SensorChart';

function SensorSelector({ data }) {
    const [selectedSensor, setSelectedSensor] = useState('');
    const [selectedMeasurementType, setSelectedMeasurementType] = useState('');
    const [measurementTypes, setMeasurementTypes] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isDateRangeValid, setIsDateRangeValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [type, setType] = useState({});

    const handleChange = (event) => {
        setSelectedSensor(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleMeasurementTypeChange = (event) => {
        setSelectedMeasurementType(event.target.value);
    };

    useEffect(() => {
        if (startDate && endDate) {
            setIsDateRangeValid(startDate <= endDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // Recupera le tipologie di misura dal backend e aggiorna lo stato del componente
        const fetchData = async () => {
            const response = await axios.get('/sensors/data/types');
            setMeasurementTypes(response.data);
        };
        fetchData();
    }, []);

    const handleGetData = () => {
        if (isDateRangeValid) {
            setIsLoading(true);
            setType(selectedMeasurementType);
            axios.post('/sensors/data/retrieve', {
                sensorId: selectedSensor,
                startDate: startDate,
                endDate: endDate,
                type: selectedMeasurementType
            })
                .then((response) => {
                    setIsLoading(false);
                    console.log(`Retrieved data for sensor ${selectedSensor} from ${startDate} to ${endDate}:`, response.data);
                    setResponseData(response.data);
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                });
        } else {
            console.log('Please select a valid date range.');
        }
    };

    const handleDownloadData = () => {
        if (isDateRangeValid) {
            setIsDownloading(true);
            axios.post('/sensors/data/sensor', {
                id: selectedSensor,
                startDate: startDate,
                endDate: endDate
            })
                .then((response) => {
                    setIsDownloading(false);
                    const json = JSON.stringify(response.data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    FileSaver.saveAs(blob, `${selectedSensor}_data_from_${startDate}_to_${endDate}.json`);
                })
                .catch((error) => {
                    console.error(error);
                    setIsDownloading(false);
                });
        }
    };

    return (
        <div>
            <Typography variant="h6" fontSize={18}>Seleziona un sensore e il tipo di misura</Typography>
            <Box sx={{ mt: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">ID sensore</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedSensor}
                                label="ID sensore"
                                onChange={handleChange}
                                MenuProps={{
                                    TransitionComponent: Fade,
                                    transitionDuration: 500,
                                }}
                            >
                                <MenuItem value={null}>
                                    -
                                </MenuItem>
                                {data.map((sensor) => (
                                    <MenuItem key={sensor.id} value={sensor.id}>
                                        {sensor.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="measurement-type-select-label">Tipologia di misura</InputLabel>
                            <Select
                                labelId="measurement-type-select-label"
                                id="measurement-type-select"
                                value={selectedMeasurementType}
                                label="Tipologia di misura"
                                onChange={handleMeasurementTypeChange}
                                MenuProps={{
                                    TransitionComponent: Fade,
                                    transitionDuration: 500,
                                }}
                            >
                                <MenuItem value={null}>
                                    -
                                </MenuItem>
                                {measurementTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Typography variant="h6" fontSize={18} sx={{ mt: '3%' }}>Seleziona un intervallo di tempo</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2, mt: '3%' }}>
                    <DatePicker
                        label="Data di inizio"
                        format="DD/MM/YYYY"
                        value={startDate}
                        onChange={handleStartDateChange}
                        TextFieldComponent={TextField}
                    />
                    <DatePicker
                        label="Data di fine"
                        format="DD/MM/YYYY"
                        value={endDate}
                        onChange={handleEndDateChange}
                        TextFieldComponent={TextField}
                    />
                </Box>
            </LocalizationProvider>
            {!isDateRangeValid && (
                <Typography color="error">Seleziona un intervallo di tempo corretto.</Typography>
            )}
            <Box sx={{ display: 'flex', mt: 2.5, justifyContent: 'left' }}>
                <Button
                    variant="contained"
                    color='secondary'
                    onClick={handleGetData}
                    disabled={!isDateRangeValid || isLoading || !selectedSensor || !startDate || !endDate || !selectedMeasurementType}
                    sx={{ width: 200 }}
                >
                    {isLoading ? (
                        <CircularProgress size={24.5} color="inherit" />
                    ) : (
                        'Visualizza grafico'
                    )}
                </Button>
                <Tooltip title='Clicca per scaricare i dati' arrow placement='right'>
                    <span>
                        <Button
                            color='primary'
                            onClick={handleDownloadData}
                            disabled={!isDateRangeValid || isDownloading || !selectedSensor || !startDate || !endDate}
                            sx={{ ml: 1 }}
                        >
                            {isDownloading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <DownloadIcon />
                            )}
                        </Button>
                    </span>
                </Tooltip>
                {Object.keys(responseData).length > 0 && (
                    <Link sx={{ mt: 1, ml: 'auto' }} href='https://snapshots.raintank.io/dashboard/snapshot/JBUwH1IwXNClwipSwOnnumUox8OJIWKA' target='_blank'>
                        Visualizza grafici dettagliati
                    </Link>
                )}
            </Box>
            {Object.keys(responseData).length > 0 && (
                <SensorChart data={{ prop1: responseData, prop2: type }} />
            )}
        </div>
    );
}

export default SensorSelector;