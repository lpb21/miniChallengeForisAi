const axios = require('axios');
const fs = require('fs');

async function main() {
    try {
        // 1. Solicitar el token de autenticación
        const loginResponse = await axios.post('http://mini-challenge.foris.ai/login', {
            username: 'foris_challenge',
            password: 'ForisChallenge'
        });
        const token = loginResponse.data.access_token;
        console.log(12, 'Token obtenido:', token);

        // 2. Obtener la pregunta del desafío
        const challengeResponse = await axios.get('http://mini-challenge.foris.ai/challenge', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const question = challengeResponse.data;
        console.log(21, 'Pregunta del desafío:', question);

        // 3. Descargar el archivo SQL del dump de MySQL
        const response = await axios.get('http://mini-challenge.foris.ai/dumps/mysql', {
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            responseType: 'stream'
        });

        // 4. Guardar el archivo localmente
        const writer = fs.createWriteStream('mysql_dump.sql');
        response.data.pipe(writer);

        writer.on('finish', () => console.log("Archivo 'mysql_dump.sql' descargado exitosamente"));
        writer.on('error', (err) => console.error('Error al guardar el archivo:', err));

    } catch (error) {
        console.error('Error:', error.message || error.response?.data);
    }
}

main();
