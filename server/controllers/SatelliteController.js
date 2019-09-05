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
                throw new Error("HA THAT DOESN'T EXIST!")
            }
            res.send(data)
        }
        catch (error) { next(error) }
    }
    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.creatorId = req.session.uid
            let data = await _satelliteService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }
    async edit(req, res, next) {
        try {
            let data = await _satelliteService.findOneAndUpdate({ _id: req.params.id, creatorId: req.session.uid }, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }
    async delete(req, res, next) {
        try {
            let data = await _satelliteService.findOneAndRemove({ _id: req.params.id, creatorId: req.session.uid })
            if (!data) {
                throw new Error("invalid id, you didn't say the magic word")
            }
            res.send("deleted value")
        } catch (error) { next(error) }

    }

}
