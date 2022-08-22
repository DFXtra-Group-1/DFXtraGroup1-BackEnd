import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
import { expect } from 'chai';
import graduateSchema from '../src/models/graduate.model.js'

import graduateTest from './graduate-user-test.json' assert {type: "json"};
import Graduate from '../src/models/graduate.model.js';

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
    });

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

    it('Test 3 - should update gitHub with new data', async () => {
        const putRes = await chai.request(server)
            .put('/graduate/1')
            .send(
                {
                    gitHub: "davidWannsinnGithubEdited"
                }
            )

        const getRes = await chai.request(server)
            .get('/graduate/1')
            .send()
        // console.log(res.body);

        expect(putRes).to.have.status(201);
        expect(getRes.body.gitHub).to.be.eql("davidWannsinnGithubEdited");

    });

    it('Test 4 - PUT/ should update multiple fields with new data', async () => {
        const putRes = await chai.request(server)
            .put('/graduate/1')
            .send(
                {   
                    firstName: "Davina",
                    gitHub: "davidWannsinnGithubEdited"
                }
            )

        const getRes = await chai.request(server)
            .get('/graduate/1')
            .send()
        // console.log(res.body);
        
        // PUT request checks
        expect(putRes).to.have.status(201);

        // GET request checks
        expect(getRes.body.firstName).to.be.eql("Davina")
        expect(getRes.body.gitHub).to.be.eql("davidWannsinnGithubEdited");

    });
})




