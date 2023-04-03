import { Box, Typography } from '@mui/material';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import { mean } from 'lodash'

const SensorDataChart = (props) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatTooltipTimestamp = (timestamp) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', options);
  };

  const formatTemperature = (temperature) => {
    return `${temperature}°C`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const timestamp = formatTooltipTimestamp(label);
      const temperatura = formatTemperature(payload[0].value);
      return (
        <Box bgcolor='white' sx={{ height: 70, display: 'flex', flexDirection: 'column', px: 3, justifyContent: 'center' }}>
          <Typography>{`Timestamp: `}<b>{timestamp}</b></Typography>
          <Typography>{`Temperatura: `}<b>{temperatura}</b></Typography>
        </Box>
      );
    }
    return null;
  };

  const data = props.data?.readings;
  const avgValue = data && data.length > 0 ? mean(data.map((reading) => reading.value)).toFixed(1) : 0;

  return (
    <Box sx={{
      mt: '5%',
      ml: 'auto',
    }}>
      {props.data && props.data.readings && props.data.readings.length > 0 && (
        <LineChart width={500} height={300} data={props.data.readings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
          <YAxis tickFormatter={formatTemperature} />
          <Tooltip content={<CustomTooltip />} />
          <Legend align='right' />
          <Line type="monotone" dataKey="value" name='temperatura' stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={avgValue} name='media' stroke="#f50057" />
          <ReferenceLine y={avgValue} stroke="#f50057" strokeDasharray="6 6">
            <Label
              position="bottom"
              value={`Media: ${formatTemperature(avgValue)}`}
              fill="#f50057"
              fontSize={13}
              offset={5}
            />
          </ReferenceLine>
        </LineChart>
      )}
      {!props.data || !props.data.readings || props.data.readings.length === 0 && (
        <p>Nessun dato disponibile.</p>
      )}
    </Box>
  );
};

export default SensorDataChart;