import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Container } from '@mui/material';
import './index.css'; // Asegúrate de importar tu archivo CSS
import backgroundVideo from './assets/bg.mp4'; // Importa el video

const WebSocketComponent = () => {
    const [messages, setMessages] = useState({
        'sensors/temperature': '',
        'sensors/humidity': '',
        'sensors/distance': '',
        'sensors/flame': '',
        'sensors/soilMoisture': ''
    });

    useEffect(() => {
        const ws = new WebSocket('ws://159.223.155.207:3000'); // Reemplaza con la dirección de tu servidor WebSocket

        ws.onopen = () => {
            console.log('Conectado al servidor WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Mensaje recibido:', data);

            setMessages(prevMessages => ({
                ...prevMessages,
                [data.topic]: data.message
            }));
        };

        ws.onclose = () => {
            console.log('Desconectado del servidor WebSocket');
        };

        ws.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    const renderCard = (topic, title, color) => {
        let value = messages[topic];
        let unit = '';
        let additionalInfo = '';

        switch(topic) {
            case 'sensors/temperature':
                unit = ' °C';
                break;
            case 'sensors/humidity':
            case 'sensors/soilMoisture':
                unit = ' %';
                break;
            case 'sensors/distance':
                unit = ' cm';
                break;
            case 'sensors/flame':
                additionalInfo = value === '1' ? '¡Peligro! Presencia de fuego detectada.' : 'No hay presencia de fuego.';
                break;
            default:
                unit = '';
        }

        return (
            <Grid item xs={12} sm={6} md={4} key={topic}>
                <Card style={{ backgroundColor: color, transition: 'transform 0.2s' }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        {value !== '0' && value !== '1' && (
                            <Typography variant="body2" color="text.secondary">
                                {value ? `${value}${unit}` : 'No data'}
                            </Typography>
                        )}
                        {additionalInfo && (
                            <Typography variant="body2" color={value === '1' ? 'error' : 'textSecondary'}>
                                {additionalInfo}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        );
    };

    return (
        <div className="content">
            <video autoPlay loop muted className="video-bg">
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
            >
                <Container>
                    <Typography variant="h4" component="h2" gutterBottom textAlign="center">
                        Rover Curiosity - UCA
                    </Typography>
                    <Grid container spacing={2}>
                        {renderCard('sensors/temperature', 'Temperatura ambiente', '#f44336')}
                        {renderCard('sensors/humidity', 'Humedad en el aire', '#2196f3')}
                        {renderCard('sensors/distance', 'Aproximación de objeto', '#4caf50')}
                        {renderCard('sensors/flame', 'Presencia de inflamables', '#ff9800')}
                        {renderCard('sensors/soilMoisture', 'Humedad del suelo', '#795548')}
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default WebSocketComponent;


