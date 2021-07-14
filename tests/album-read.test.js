const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('read album', () => {
    let db;
    let albums;

    beforeEach(async () => {
        db = await getDb();
        await Promise.all([
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'Ride The Lightning',
                1984,
            ]),
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'The Division Bell',
                1994,
            ]),
            db.query('INSERT INTO Album (name, year) VALUES (?, ?)', [
                'Juturna',
                2005,
            ]),
        ]);

        [albums] = await db.query('SELECT * FROM Album');
    });

    afterEach(async () => {
        await db.query('DELETE FROM Album');
        await db.close();
    });

    describe('/album', () => {
        describe('GET', () => {
            it('returns all album records in the database', async () => {
                const res = await request(app).get('/album').send();

                expect (res.status).to.equal(200);
                expect (res.body.length).to.equal(3);

                res.body.forEach(albumRecord => {
                    const expectedRecord = albums.find(album => album.id === albumRecord.id);

                    expect(albumRecord).to.deep.equal(expectedRecord);
                });
            });
        });
    });

    describe('/album/:albumId', () => {
        describe('GET', () => {
            it('returns a single album with correct id', async () =>{
                const expectedAlbum = albums[0];
                const res = await request(app).get(`/album/${expectedAlbum.id}`).send();

                expect(res.status).to.equal(200);
                expect(res.body).to.deep.equal(expectedAlbum);
            });

            it('returns a 404 if the album is not in the database', async () => {
                const res = await request(app).get('/album/999999').send();

                expect(res.status).to.equal(404);
            });
        });
    });
});