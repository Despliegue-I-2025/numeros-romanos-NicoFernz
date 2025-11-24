const request = require('supertest');
const { app, romanToArabic, arabicToRoman } = require('../romanos');

describe('Funciones de conversión', () => {
    describe('romanToArabic', () => {
        test('convierte números simples', () => {
            expect(romanToArabic('I')).toBe(1);
            expect(romanToArabic('IV')).toBe(4);
            expect(romanToArabic('IX')).toBe(9);
            expect(romanToArabic('XL')).toBe(40);
            expect(romanToArabic('MCMXCIX')).toBe(1999);
            expect(romanToArabic(' xxiv ')).toBe(24);
        });

        test('retorna null para romanos inválidos', () => {
            expect(romanToArabic('')).toBeNull();
            expect(romanToArabic(null)).toBeNull();
            expect(romanToArabic('IIII')).toBeNull();
            expect(romanToArabic('MMMM')).toBeNull();
            expect(romanToArabic('ABC')).toBeNull();
        });
    });

    describe('arabicToRoman', () => {
        test('convierte números al romano', () => {
            expect(arabicToRoman(1)).toBe('I');
            expect(arabicToRoman(4)).toBe('IV');
            expect(arabicToRoman(9)).toBe('IX');
            expect(arabicToRoman(24)).toBe('XXIV');
            expect(arabicToRoman(1999)).toBe('MCMXCIX');
        });

        test('retorna null para valores inválidos', () => {
            expect(arabicToRoman(0)).toBeNull();
            expect(arabicToRoman(4000)).toBeNull();
            expect(arabicToRoman(3.5)).toBeNull();
            expect(arabicToRoman('100')).toBeNull();
        });
    });
});

describe('Endpoints HTTP', () => {
    describe('GET /r2a', () => {
        test('200 para romano válido', async () => {
            const res = await request(app).get('/r2a').query({ roman: 'XXIV' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ arabic: 24 });
        });

        test('400 cuando falta parámetro', async () => {
            const res = await request(app).get('/r2a');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('422 para romano inválido', async () => {
            const res = await request(app).get('/r2a').query({ roman: 'IIII' });
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /a2r', () => {
        test('200 para arábigo válido', async () => {
            const res = await request(app).get('/a2r').query({ arabic: '1999' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ roman: 'MCMXCIX' });
        });

        test('400 cuando falta parámetro', async () => {
            const res = await request(app).get('/a2r');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('422 para arábigo fuera de rango', async () => {
            const res = await request(app).get('/a2r').query({ arabic: '4000' });
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('error');
        });

        test('422 para arábigo no entero', async () => {
            const res = await request(app).get('/a2r').query({ arabic: '3.5' });
            expect(res.status).toBe(422);
            expect(res.body).toHaveProperty('error');
        });
    });
});
