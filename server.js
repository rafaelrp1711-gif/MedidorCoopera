const express = require('express');
const { simular } = require('./calculos');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/simular', function(req, res) {
    const aparelhos = req.body.aparelhos;

    if (!Array.isArray(aparelhos) || aparelhos.length === 0) {
        return res.status(400).json({
            erro: 'Adicione pelo menos um aparelho.'
        });
    }

    for (let i = 0; i < aparelhos.length; i++) {
        const aparelho = aparelhos[i];

        if (!aparelho.nome || aparelho.nome.trim() === '') {
            return res.status(400).json({
                erro: `Nome inválido no aparelho ${i + 1}.`
            });
        }

        if (typeof aparelho.potenciaW !== 'number' ||
            aparelho.potenciaW < 1 ||
            aparelho.potenciaW > 10000) {
            return res.status(400).json({
                erro: `Potência inválida no aparelho ${i + 1}.`
            });
        }

        if (typeof aparelho.horasDia !== 'number' ||
            aparelho.horasDia < 0 ||
            aparelho.horasDia > 24) {
            return res.status(400).json({
                erro: `Horas inválidas no aparelho ${i + 1}.`
            });
        }

        if (typeof aparelho.diasMes !== 'number' ||
            !Number.isInteger(aparelho.diasMes) ||
            aparelho.diasMes < 1 ||
            aparelho.diasMes > 31) {
            return res.status(400).json({
                erro: `Dias inválidos no aparelho ${i + 1}.`
            });
        }
    }

    res.json(simular(aparelhos));
});

app.listen(3000, function() {
    console.log('Medidor Coopera em http://localhost:3000');
});