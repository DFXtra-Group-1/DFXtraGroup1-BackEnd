import express from 'express'
import Graduate from '../models/graduate.model.js';

const router = express.Router();


router.route(`/`)
    .get((req, res) => {
        Graduate.find((error, graduate) => {
            graduate ? res.json(graduate) : res.status(404).send(`Not found`);
        });
    });

router.route("/:uuid")
    .get(async (req, res) => {
        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {
            if (error) {
                console.log(error)
            }
            graduate ? res.json(graduate) : res.status(404).send(`Not found`);
        });
    })
    .put(async (req, res) => {

        Graduate.findOneAndUpdate(
            { uuid: req.params.uuid },
            req.body,
            (error, doc) => {
                if (error) console.log(error)

                res.status(201).send();
            });
    })


router.route("/:uuid/degrees")
    .get(async (req, res) => {

        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {

            if (error) {
                console.log(error);
            }
            else {
                graduate.degrees.forEach(degree => {
                    if (degree._id == req.body._id) {
                        res.status(200).send(degree);
                    }
                });

                res.status(404).send();
            }
        });
    })
    .put(async (req, res) => {
        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {
            if (error) {
                console.log(error);
            }
            else {
                for (let i = 0; i < graduate.degrees.length; i++) {

                    if (graduate.degrees[i]._id == req.body._id) {

                        graduate.degrees[i] = req.body;

                        graduate.save((saveError, saveRes) => {
                            if (saveError) {
                                res.status(400).send("saveError.message")
                            }
                            res.status(200).send(graduate);
                        })

                    }
                }
            }
        });
    })
    .post(async (req, res) => {
        console.log(req.body);
        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {

            if (error) {
                console.log(error);
            }
            else {
                graduate.degrees.push(req.body);

                graduate.save((saveError, saveRes) => {
                    if (saveError) {
                        res.status(400).send("saveError.message")
                    }
                    res.status(201).send(graduate);
                })
            }
        })
    });

//////// The below code works but is not used , it is good for learning purpose ////////////////////////
router.route("/:uuid/degrees")
    .get(async (req, res) => {

        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {

            if (error) {
                console.log(error);
            }
            else {
                graduate.degrees.forEach(degree => {
                    if (degree._id == req.body._id) {
                        res.status(200).send(degree);
                    }
                });

                res.status(404).send();
            }
        });
    })
    .put(async (req, res) => {
        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {
            if (error) {
                console.log(error);
            }
            else {
                for (let i = 0; i < graduate.degrees.length; i++) {

                    if (graduate.degrees[i]._id == req.body._id) {

                        graduate.degrees[i] = req.body;

                        graduate.save((saveError, saveRes) => {
                            if (saveError) {
                                res.status(400).send("saveError.message")
                            }
                            res.status(200).send(graduate);
                        })

                    }
                }
            }
        });
    })



router.route(`/:uuid/:key`)
    .post(async (req, res) => {
        let key1 = req.params.key
        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {
            if (error) {
                console.log(error);
            }
            else {
                graduate[req.params.key].push(req.body);
                graduate.save((saveError, saveRes) => {
                    if (saveError) {
                        res.status(400).send("saveError.message")
                    }
                    res.status(201).send(graduate);
                })
            }
        })
    });






export { router as graduate };