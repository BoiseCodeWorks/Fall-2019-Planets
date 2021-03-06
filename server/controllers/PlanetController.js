import express from 'express'
import PlanetService from '../services/PlanetService';
import { Authorize } from '../middleware/authorize.js'
import MoonService from '../services/MoonService';
import SatelliteService from '../services/SatelliteService';

let _planetService = new PlanetService().repository
let _moonService = new MoonService().repository
let _satService = new SatelliteService().repository

export default class PlanetController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/moons', this.getMoons)
            .get('/:id/satellites', this.getSatellites)
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            let data = await _planetService.find({})
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _planetService.findById(req.params.id)
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async getMoons(req, res, next) {
        try {
            let data = await _moonService.find({ planetId: req.params.id }).populate("planetId", "name")

            return res.send(data)
        } catch (error) { next(error) }
    }


    async getSatellites(req, res, next) {
        try {
            let data = await _satService.find({ planetId: req.params.id }).populate("planetId", "name")

            return res.send(data)
        } catch (error) { next(error) }
    }


    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.creatorId = req.session.uid
            let data = await _planetService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _planetService.findOneAndUpdate({ _id: req.params.id, creatorId: req.session.uid }, req.body, { new: true })
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
            let data = await _planetService.findOneAndRemove({ _id: req.params.id, creatorId: req.session.uid })
            if (!data) {
                throw new Error("invalid id, you didn't say the magic word")
            }
            res.send("deleted value")
        } catch (error) { next(error) }

    }

}