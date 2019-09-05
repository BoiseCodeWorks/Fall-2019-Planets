import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    name: { type: String, required: true },
    habitable: { type: Boolean, required: true },
    population: { type: Number, required: true },
    creatorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class PlanetService {
    get repository() {
        return mongoose.model('planet', _model)
    }
}