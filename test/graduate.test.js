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


    // ---------------------------------------
    it('Test 5 - GET/ should find specific subdocument', async () => {
        const getRes = await chai.request(server)
            .get('/graduate/2/degrees')
            .send(
                {
                    _id: '6303b9f3eb5681b1a15ebb8b'
                }
            )

        //console.log(getRes.body)
        // PUT request checks

        // GET request checks
        expect(getRes.status).to.be.eql(200)
        expect(getRes.body._id).to.be.eql("6303b9f3eb5681b1a15ebb8b")
    });



    it('Test 6 - PUT/ should update one field in subdocs (degrees) with new data', async () => {
        const getRes = await chai.request(server)
            .put('/graduate/2/degrees')
            .send(
                {
                    university: 'MIT',
                    degreeSubject: 'Physics',
                    degreeLevel: "Bachelor's",
                    grade: '1:1',
                    fromDate: '2011',
                    toDate: '2015',
                    weight: 'XL',
                    priority: '9',
                    description: 'A physics degree',
                    _id: '6303b9f3eb5681b1a15ebb8b'
                }
            )

        //console.log("RES BODT" + getRes)
        // PUT request checks

        // GET request checks
        expect(getRes.status).to.be.eql(200)
        expect(getRes.body.degrees[0]._id).to.be.eql("6303b9f3eb5681b1a15ebb8b")
        expect(getRes.body.degrees[0].university).to.be.eql("MIT")


    });


    // check out https://stackoverflow.com/questions/46618860/mongoose-partial-update-of-an-object
    xit('Test 7 - PUT/ should update one field in subdocs (degrees) with new data', async () => {
        const getRes = await chai.request(server)
            .put('/graduate/2/degrees')
            .send(
                {
                    university: 'MIT',
                    degreeSubject: 'Physics',
                    degreeLevel: "Bachelor's",
                    grade: '1:1',
                    fromDate: '2011',
                    description: 'A physics degree',
                    _id: '6303b9f3eb5681b1a15ebb8b'
                }
            )

        //console.log("RES BODT" + getRes)
        // PUT request checks

        // GET request checks
        expect(getRes.status).to.be.eql(200)
        expect(getRes.body.degrees[0]._id).to.be.eql("6303b9f3eb5681b1a15ebb8b")
        expect(getRes.body.degrees[0].university).to.be.eql("MIT")
        expect(getRes.body.degrees[0].degreeSubject).to.be.eql("Physics")
        expect(getRes.body.degrees[0].degreeLevel).to.be.eql("Bachelor's")
        expect(getRes.body.degrees[0].grade).to.be.eql("1:1")
        expect(getRes.body.degrees[0].fromDate).to.be.eql("2011")
        expect(getRes.body.degrees[0].toDate).to.be.eql("2015")
        expect(getRes.body.degrees[0].weight).to.be.eql("XL")
        expect(getRes.body.degrees[0].priority).to.be.eql("9")
        expect(getRes.body.degrees[0].description).to.be.eql("A physics degree")


    });

    it('test 8 - POST/ should add a degree to the degrees array', async () => {
        const postRes = await chai.request(server)
            .post('/graduate/2/degrees')
            .send({
                university: 'UCL',
                degreeSubject: 'Quantum Physics',
                degreeLevel: "Master's",
                grade: '1:1',
                fromDate: '2016',
                toDate: '2018',
                weight: 'XL',
                priority: '8',
                description: 'A quantum physics degree'
            })

        // POST request checks
        expect(postRes.status).to.be.eql(201)
        expect(postRes.body.degrees[0].university).to.be.eql("UCL")
        expect(postRes.body.degrees[0].degreeSubject).to.be.eql("Quantum Physics")
        expect(postRes.body.degrees[0].degreeLevel).to.be.eql("Master's")
        expect(postRes.body.degrees[0].grade).to.be.eql("1:1")
        expect(postRes.body.degrees[0].fromDate).to.be.eql("2016")
        expect(postRes.body.degrees[0].toDate).to.be.eql("2018")
        expect(postRes.body.degrees[0].weight).to.be.eql("XL")
        expect(postRes.body.degrees[0].priority).to.be.eql("8")
        expect(postRes.body.degrees[0].description).to.be.eql("A quantum physics degree")
    })

})




