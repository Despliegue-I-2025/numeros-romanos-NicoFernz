const { arabicToRoman } = require('../romanos');

module.exports = (req, res) => {
    // Headers CORS
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Método no permitido. Use GET.' });
    }

    if (req.query.arabic === undefined) {
        return res.status(400).json({ error: 'Parámetro "arabic" requerido.' });
    }

    const parsed = Number(req.query.arabic);
    if (!Number.isInteger(parsed)) {
        return res.status(400).json({ error: 'El parámetro "arabic" debe ser un entero.' });
    }

    const romanNumeral = arabicToRoman(parsed);
    if (romanNumeral === null) {
        return res.status(400).json({ error: 'Número arábigo inválido o fuera de rango (1-3999).' });
    }

    return res.json({ roman: romanNumeral });
};
