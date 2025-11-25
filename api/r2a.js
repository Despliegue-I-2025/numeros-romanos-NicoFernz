const { romanToArabic } = require('../romanos');

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

    const romanNumeral = req.query.roman;
    if (!romanNumeral) {
        return res.status(400).json({ error: 'Parámetro "roman" requerido.' });
    }

    const arabicNumber = romanToArabic(romanNumeral);
    if (arabicNumber === null) {
        return res.status(400).json({ error: 'Número romano inválido o fuera de rango (1-3999).' });
    }

    return res.json({ arabic: arabicNumber });
};
