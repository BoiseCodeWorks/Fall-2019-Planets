import express from 'express'
import PlanetService from '../services/PlanetService';
import { Authorize } from '../middleware/authorize.js'
import SatelliteService from '../services/SatelliteService';
import CompanyService from '../services/CompanyService.js'

let _planetService = new PlanetService().repository
let _satelliteService = new SatelliteService().repository
let _companyService = new CompanyService().repository
export default class CompanyController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/satellites', this.getSatellites)
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getSatellites(req, res, next) {
        try {
            let data = await _satelliteService.find({ companyId: req.params.id }).populate("companyId", "name")

            return res.send(data)
        } catch (error) { next(error) }
    }

    async getAll(req, res, next) {
        try {
            let data = await _companyService.find({})
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _companyService.findById(req.params.id)
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }


    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.creatorId = req.session.uid
            let data = await _companyService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _companyService.findOneAndUpdate({ _id: req.params.id, creatorId: req.session.uid }, req.body, { new: true })
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
            let data = await _companyService.findOneAndRemove({ _id: req.params.id, creatorId: req.session.uid })
            if (!data) {
                throw new Error("invalid id, you didn't say the magic word")
            }
            res.send("deleted value")
        } catch (error) { next(error) }

    }

}