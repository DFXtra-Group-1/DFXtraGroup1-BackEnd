import express from 'express'
import Graduate from '../models/graduate.model.js';

const router = express.Router();


router.route(`/`)
    .get((req, res) => {
        Graduate.find((error, Graduate) => {
            error ? res.status(404).send(`Not found`) : res.json(Graduate);
        });
    });

router.route("/:uuid")
    .get(async (req, res) => {
        Graduate.where({ uuid: req.params.uuid }).findOne((error, Graduate) => {
            if (error) {
                console.log(error)
            }
            Graduate ? res.json(Graduate) : res.status(404).send(`Not found`);
        });
    })
    .put( async (req, res) => {

        console.log(req.body);

        Graduate.findOneAndUpdate( 
            { uuid: req.params.uuid }, 
            req.body, 
            (error, doc) => {
                if (error) console.log(error)
                
                res.status(201).send();
            });
    });


export { router as graduate };