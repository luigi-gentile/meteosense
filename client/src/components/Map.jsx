import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

const Map = ({ data }) => {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        setSensorData(data);
    }, [data]);

    return (
        <>
            <MapContainer center={[41.320179563945935, 16.28352113026992]} zoom={15} style={{ height: '600px', width: '100%', minWidth: '300px', border: '2px solid #ccc', borderRadius: 5 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {sensorData.map(sensor => (
                    <Marker key={sensor.id} position={sensor.location.coordinates} >
                        <Popup>
                            Sensor ID: <b>{sensor.id}</b>
                            <br />
                            Latitudine: <b style={{ color: '#666666' }}>{sensor.location.coordinates[0].toFixed(6)}</b>
                            <br />
                            Longitudine: <b style={{ color: '#666666' }}>{sensor.location.coordinates[1].toFixed(6)}</b>
                            <br />
                            Stato: {sensor.status === true ? <b style={{ color: "DarkGreen" }}>Attivo</b>
                                : <b style={{ color: "crimson" }}>Spento</b>}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );
};

export default Map;