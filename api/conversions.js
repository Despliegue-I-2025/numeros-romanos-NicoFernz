const { romanToArabic, arabicToRoman } = require('../romanos');

module.exports = (req, res) => {
    const method = req.method.toUpperCase();
    let from, value;

    if (method === 'GET') {
        from = req.query.from;
        value = req.query.value;
    } else if (method === 'POST') {
        const ct = req.headers['content-type'] || '';
        if (!ct.includes('application/json')) {
            return res.status(415).json({ error: 'Se requiere Content-Type: application/json para POST.' });
        }
        from = req.body && req.body.from;
        value = req.body && req.body.value;
    } else {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    if (!from) {
        return res.status(400).json({ error: 'Parametro "from" requerido ("roman" o "arabic").' });
    }
    if (value === undefined || value === null || value === '') {
        return res.status(400).json({ error: 'Parametro "value" requerido.' });
    }

    if (from === 'roman') {
        const result = romanToArabic(String(value));
        if (result === null) return res.status(422).json({ error: 'Numero romano invalido o fuera de rango (1-3999).' });
        return res.json({ from: 'roman', value: String(value), result });
    }

    if (from === 'arabic') {
        const parsed = Number(value);
        if (!Number.isInteger(parsed)) return res.status(422).json({ error: 'El parametro "value" debe ser un entero.' });
        const result = arabicToRoman(parsed);
        if (result === null) return res.status(422).json({ error: 'Numero arabico invalido o fuera de rango (1-3999).' });
        return res.json({ from: 'arabic', value: parsed, result });
    }

    return res.status(400).json({ error: 'Parametro "from" invalido. Use "roman" o "arabic".' });
};
