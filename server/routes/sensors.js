const express = require("express");
const Sensor = require("../models/Sensor.js");

const router = express.Router();

// visualizza i dati di tutti i sensori
router.get('/data', async (req, res) => {
    try {
        const sensors = await Sensor.find({});
        // Ordina i sensori in ordine alfabetico sull'ID
        sensors.sort((a, b) => a.id.localeCompare(b.id));
        sensors.forEach(sensor => {
            // Ordina le letture in ordine cronologico
            sensor.readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });
        res.send(sensors);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

// Visualizza i dati di un singolo sensore
router.post('/data/sensor', async (req, res) => {
    const { id, startDate, endDate } = req.body;
    try {
        const sensor = await Sensor.findOne({ id });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensore non trovato' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Date non valide' });
        }
        const filteredReadings = sensor.readings.filter(reading => {
            const timestamp = new Date(reading.timestamp);
            return timestamp >= start && timestamp <= end;
        });
        const filteredSensor = { ...sensor.toObject(), readings: filteredReadings };
        res.json(filteredSensor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante la ricerca del sensore' });
    }
});

// aggiungi un nuovo sensore
router.post('/data', async (req, res) => {
    try {
        const sensor = new Sensor(req.body);
        await sensor.save();
        res.send(sensor);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// // visualizza i dati di uno specifico sensore in uno specifico data range
router.post('/data/retrieve', async (req, res) => {
    try {
        const { sensorId, startDate, endDate, type } = req.body;

        // Verifica che i parametri siano stati forniti
        if (!sensorId || !startDate || !endDate) {
            return res.status(400).json({ message: 'Parametri mancanti' });
        }

        // Verifica che le date siano valide
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Date non valide' });
        }

        // Effettua la query al database per recuperare i dati del sensore
        const sensor = await Sensor.findOne({ id: sensorId });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensore non trovato' });
        }

        // Filtra le letture del sensore in base al periodo specificato
        const readings = sensor.readings.filter(reading => {
            const timestamp = new Date(reading.timestamp);
            return timestamp >= start && timestamp <= end;
        });

        // Ordina le letture in ordine cronologico
        readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Estrai solo gli ultimi 10 readings
        const lastTenReadings = readings.slice(-24);

        // Estrai solo i dati richiesti dall'utente
        let filteredReadings = lastTenReadings.map(reading => {
            const { timestamp, temperature, humidity, pressure } = reading;
            switch (type) {
                case 'temperature':
                    return { timestamp, temperature };
                case 'humidity':
                    return { timestamp, humidity };
                case 'pressure':
                    return { timestamp, pressure };
                default:
                    return { timestamp, value: null };
            }
        });

        // Rimuovi gli elementi null se non è stato specificato un tipo di grandezza valido
        filteredReadings = filteredReadings.filter(reading => reading[Object.keys(reading)[0]] !== null);

        // Restituisci i dati del sensore filtrati per il periodo specificato e il tipo di grandezza richiesto
        res.json({
            sensorId: sensor.id,
            readings: filteredReadings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei dati del sensore' });
    }
});

// recupera tipologia di misura
router.get('/data/types', async (req, res) => {
    try {
        const sensors = await Sensor.find({});
        const types = new Set();
        sensors.forEach((sensor) => {
            sensor.readings.forEach((reading) => {
                if (reading.temperature !== undefined) {
                    types.add('temperature');
                }
                if (reading.humidity !== undefined) {
                    types.add('humidity');
                }
                if (reading.pressure !== undefined) {
                    types.add('pressure');
                }
            });
        });
        res.json(Array.from(types));
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore durante la lettura delle tipologie di misura');
    }
});

// Aggiungi un nuovo reading al sensore
router.post('/data/readings', async (req, res) => {
    const { id, timestamp, temperature, humidity, pressure } = req.body;

    try {
        const sensor = await Sensor.findOne({ id });

        if (!sensor) {
            return res.status(404).json({ error: 'Sensore non trovato' });
        }

        sensor.readings.push({ timestamp, temperature, humidity, pressure });
        await sensor.save();

        res.status(201).json(sensor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore server' });
    }
});

module.exports = router;

