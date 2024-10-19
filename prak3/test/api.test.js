import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('API Testing', () => {

    it('should return all items', (done) => {
        request(app)
            .get('/api/items')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);
                done();
            });
    });

    it('harusnya ini bikin item baru', (done) => {
        const newItem = { name: 'Item 3' };
        request(app)
            .post('/api/items')
            .send(newItem)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name', 'Item 3');
                done();
            });
    });

    it('harusnya hapus item dari idnya', (done) => {
        request(app)
            .post('/api/items')
            .send({ name: 'Item yang mau diapus' })
            .end((err, res) => {
                const itemId = res.body.id;
                request(app)
                    .delete(`/api/items/${itemId}`)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('message', 'Item deleted successfully');
                        done();
                    });
            });
    });

    it('harusnya update item dari idnya', (done) => {
        request(app)
            .post('/api/items')
            .send({ name: 'Item yang mau di update' })
            .end((err, res) => {
                const itemId = res.body.id;
                request(app)
                    .put(`/api/items/${itemId}`)
                    .send({ name: 'Updated Item' })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('name', 'Updated Item');
                        done();
                    });
            });
    });
});
