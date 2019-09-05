import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    name: { type: String, required: true },
    planetId: { type: ObjectId, ref: "planet", required: true },
    creatorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class CompanyService {
    get repository() {
        return mongoose.model('company', _model)
    }
}