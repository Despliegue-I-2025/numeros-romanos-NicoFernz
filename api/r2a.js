const { romanToArabic } = require('../romanos');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

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
    return res.status(422).json({ error: 'Número romano inválido o fuera de rango (1-3999).' });
  }

  return res.json({ arabic: arabicNumber });
};
