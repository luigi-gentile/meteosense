import { Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import { mean } from 'lodash';

const SensorChart = (props) => {
    const data = props.data?.prop1.readings;
    const avgValue = mean(data.map((reading) => Object.values(reading)[1])).toFixed(1);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        return `${hours}`;
    };

    const formatTooltipTimestamp = (timestamp) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const date = new Date(timestamp);
        return date.toLocaleString('it-IT', options);
    };

    return (
        <Box sx={{ mt: 3 }}>
            {props.data.prop1.readings.length > 0 ? (
                <LineChart width={500} height={300} data={props.data.prop1.readings} key={props.data.prop2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
                    <YAxis dataKey={props.data.prop2} label={{
                        value: props.data.prop2 === 'temperature' ? '°C'
                            : props.data.prop2 === 'humidity' ? '%' : props.data.prop2 === 'pressure' ? 'Pa' : '',
                        position: 'insideLeft',
                        offset: 0,
                        stroke: '#2880CA'
                    }} />
                    <Tooltip labelFormatter={formatTooltipTimestamp} />
                    <Legend align='right' />
                    <Line type="monotone" dataKey={props.data.prop2} stroke="#1E79C9" />
                    <Line type="monotone" dataKey={avgValue} name='media' stroke="#f50057" />
                    <ReferenceLine y={avgValue} stroke="#f50057" strokeDasharray="7 6">
                        <Label
                            position="top"
                            value={`Media: ${avgValue}`}
                            fill="#f50057"
                            fontSize={13}
                        />
                    </ReferenceLine>
                </LineChart>
            ) : (
                <p>Nessun dato disponibile.</p>
            )}
        </Box>
    );
}

export default SensorChart;