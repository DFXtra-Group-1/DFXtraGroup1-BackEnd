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
    .put( async (req, res) => {

        Graduate.findOneAndUpdate( 
            { uuid: req.params.uuid }, 
            req.body, 
            (error, doc) => {
                if (error) console.log(error)
                
                res.status(201).send();
            });
    })

router.route("/:uuid/degrees")
    .get( async (req, res) => {

        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {

            if (error) {
                console.log(error);
            }
            else{
                // console.log(graduate.degrees)
                graduate.degrees.forEach(degree => {
                    if (degree._id == req.body._id) {
                        res.status(200).send(degree);
                    }
                });

                res.status(404).send();
            }
        });
    })





    .put( async (req, res) => {

        Graduate.where({ uuid: req.params.uuid }).findOne((error, graduate) => {

            if (error) {
                console.log(error);
            }
            else{

                for (let i = 0; i < graduate.degrees.length; i++ ){

                    console.log("GRADUATe.DEGREES " + graduate.degrees)

                    if (graduate.degrees[i]._id == req.body._id) {

                        
                        graduate.degrees[i] = req.body;


                        console.log("UPDATED " + graduate.degrees[0])
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
        
    });




export { router as graduate };