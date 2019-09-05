import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    planetId: { type: ObjectId, ref: 'planet', required: true },
    creatorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class MoonService {
    get repository() {
        return mongoose.model('moon', _model)
    }
}