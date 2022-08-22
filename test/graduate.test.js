import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import server from '../server.js';
import graduateSchema from '../src/models/graduate.model.js'

import graduateTest from './graduate-user-test.json' assert {type: "json"};
import Graduate from '../src/models/graduate.model.js';

// const testData = require('./graduate-user-test.json');

chai.use(chaiHttp);

const graduateData = graduateTest.graduateUser

describe(`Tests`, () => {
    beforeEach(async () => {
        await graduateSchema.deleteMany()
            .then(() => console.log(`Database cleared`))
            .catch(error => {
                console.log(`Error clearing`)
                throw new Error();
            });
        await graduateSchema.insertMany(graduateData)
            .then(() => console.log(`Database populated with graduate test data`))
            .catch(error => {
                console.log(`Error inserting`);
                console.log(error)
                throw new Error();
            });
    })
    it('Test 1 - should get all graduate data', async () => {
        const res = await chai.request(server)
            .get('/graduate')
            .send()

        expect(res).to.have.status(200);
        expect(res.body.length).to.be.eql(graduateData.length);
        expect(res.body).to.be.an('array');
    });
    it('Test 2 - should get one graduate from database', async () => {
        const res = await chai.request(server)
            .get('/graduate/1')
            .send()

        expect(res).to.have.status(200);
        expect(res.body.uuid).to.be.equal(1);
        expect(res.body).to.have.property("firstName")
        expect(res.body.firstName).to.be.eql("David")
        expect(res.body.digitalFuturesEmail).to.be.eql("davesinnwann@digitalfutures.com")

    });


    it('Test 3 - should edit graduate data in the database', () => {
        const res = await chai.request(server)
            .post('/graduate/1')
            .send({
                "gitHub": "DavidWannSinnEdited",
            })
        expect(res).to.have.status(201);
        expect(res.body.uuid).to.be.equal(1);
        expect(res.body.gitHub).to.be.eql("DavidWannSinnEdited")

    })



})




