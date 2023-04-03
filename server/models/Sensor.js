const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: Boolean,
        default: true
    },
    readings: [
        {
            timestamp: {
                type: Date,
                required: true
            },
            temperature: {
                type: Number,
                required: true
            },
            humidity: {
                type: Number,
                required: true
            },
            pressure: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Sensor', sensorSchema, "sensors");