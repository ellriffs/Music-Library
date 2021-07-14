const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
    let db;
    let artists;
    beforeEach(async() => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
                'Animals As Leaders',
                'Progressive',
            ]),
        ]);
        [artists] = await db.query('SELECT * FROM Artist');
    });
    
    afterEach(async () => {
        await db.query('DELETE FROM Artist');
        await db.close();
    });

    describe('/album', () => {
        describe('POST', () => {
            it('creates a new album in the Album table', async () => {
                const res = await request(app).post('/album').send({
                    name: 'The Joy of Motion',
                    year: '2014',
                    artistId: artists[0].id,
                });
                expect(res.status).to.equal(201);

                const [[albumEntries]] = await db.query(
                    `SELECT * FROM Album WHERE name = 'The Joy of Motion'`
                );
                expect(albumEntries.name).to.equal('The Joy of Motion');
                expect(albumEntries.year).to.equal(2014);
            });
        });
    });
});