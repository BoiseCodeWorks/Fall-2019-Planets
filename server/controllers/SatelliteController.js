import express from 'express'
import PlanetService from '../services/PlanetService';
import { Authorize } from '../middleware/authorize.js'
import SatelliteService from '../services/SatelliteService';
import CompanyService from '../services/CompanyService';

let _planetService = new PlanetService().repository
let _companyService = new CompanyService().repository
let _satelliteService = new SatelliteService().repository

export default class SatelliteController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getById(req, res, next) {

        try {
            let data = await _satelliteService.findById(req.params.id)
            if (!data) {
                throw new Error("HA THAT DOESN'T EXSIT!")
            }
            res.send(data)
        }
        catch (error) { next(error) }
    }
}
