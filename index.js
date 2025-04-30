import express from 'express'; // Importa express
import app from './src/app.js';
import { connectDb } from './src/db.js';

await connectDb();

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

app.listen(4000, () => {
    console.log('Server on port', 4000);
});