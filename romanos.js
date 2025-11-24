const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Romanos a Arabigos
app.get('/r2a', (req, res) => {
  const romanNumeral = req.query.roman;
  if (!romanNumeral) {
    return res.status(400).json({ error: 'Parametro "roman" requerido.' });
  }

  const arabicNumber = romanToArabic(romanNumeral);
  if (arabicNumber === null) {
    return res.status(422).json({ error: 'Numero romano invalido o fuera de rango (1-3999).' });
  }

  return res.json({ arabic: arabicNumber });
});

// Arabigos a Romanos
app.get('/a2r', (req, res) => {
  if (req.query.arabic === undefined) {
    return res.status(400).json({ error: 'Parametro "arabic" requerido.' });
  }

  const parsed = Number(req.query.arabic);
  if (!Number.isInteger(parsed)) {
    return res.status(422).json({ error: 'El parametro "arabic" debe ser un entero.' });
  }

  const romanNumeral = arabicToRoman(parsed);
  if (romanNumeral === null) {
    return res.status(422).json({ error: 'Numero arabico invalido o fuera de rango (1-3999).' });
  }

  return res.json({ roman: romanNumeral });
});

function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') return null;
  const s = roman.toUpperCase().trim();
  // Valid Roman numeral pattern (1..3999)
  const validRoman = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  if (!validRoman.test(s)) return null;

  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const value = map[s[i]];
    const next = map[s[i + 1]] || 0;
    if (value < next) total -= value; else total += value;
  }
  if (total < 1 || total > 3999) return null;
  return total;
}
function arabicToRoman(arabic) {
  if (typeof arabic !== 'number' || !Number.isInteger(arabic)) return null;
  if (arabic < 1 || arabic > 3999) return null;

  const val = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const sym = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let num = arabic;
  let res = '';
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      res += sym[i];
      num -= val[i];
    }
  }
  return res;
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Conversor numerico escuchando en el puerto ${PORT}`);
  });
}


module.exports = { app, romanToArabic, arabicToRoman };
