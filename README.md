# MeteoSense app
## Descrizione
Il progetto "MeteoSense" mira a sviluppare una piattaforma web-based per raccogliere, gestire e visualizzare i dati meteorologici provenienti da sensori dislocati sul territorio. La piattaforma consente all'utente di registrarsi, accedere in modo sicuro e autenticarsi tramite un codice OTP. Gli utenti possono visualizzare una mappa con la posizione dei sensori, selezionare il sensore e l'intervallo di tempo desiderati, e analizzare l'andamento delle misurazioni attraverso un grafico. Inoltre, è possibile scaricare le misurazioni dell'intervallo selezionato e accedere alla dashboard di Grafana per una visualizzazione più completa dei dati.
## Dipendenze server
* nodejs
* npm
* express
* mongoose
* body-parser
* dotenv
* cors
* nodemailer
* jsonwebtoken

## Dipendenze client
* react
* @mui/material
* axios
* chart.js
* date-fns
* file-saver
* react-leaflet
* recharts

## Installazione
1. Clona il repository
2. Installa le dipendenze del server: recarsi in /server ed eseguire `npm install`
3. Installa le dipendenze del client: recarsi in /client ed eseguire `npm install --legacy-peer-deps`
4. Avvia il server: in /server eseguire `npm start`
5. Avvia il client: in /client eseguire `npm start`
6. Puoi accedere al servizio all'indirizzo `http://localhost:3000`

## Configurazione
Per eseguire correttamente l'applicazione bisogna:
1. Creare un file `.env` in /server
2. Aggiungere le variabili d'ambiente necessarie
```javascript
PORT=5060
MONGO_URI=***
JWT_SECRET=***
EMAIL_USER=***
EMAIL_PASSWORD=***
```

## Struttura del progetto
* /client - applicazione react
* /documentation - documentazione finale
* /server - applicazione node
* docker-compose.yaml 
* README.md

## Funzionalità
* Registrazione e accesso utenti
* Visualizzazione di una mappa con la posizione dei sensori
* Analisi dell'andamento delle misure effettuate dai sensori
* Visualizzazione di grafici dettagliati
* Downlaod dei dati in formato JSON

## Tecnologie utilizzate
* Node.js - ambiente di esecuzione JavaScript lato server
* MongoDB - database NoSQL utilizzato per memorizzare i dati dell'applicazione
* Express - framework per creare applicazioni web in Node.js
* React - libreria JavaScript per creare interfacce utente
* Docker - piattaforma di containerizzazione
* Grafana - software di analisi e visualizzazione dei dati