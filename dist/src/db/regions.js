"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionsWithinDistance = exports.getRegionsByPoint = exports.updateRegionById = exports.deleteRegionById = exports.createRegion = exports.getRegionById = exports.getRegions = exports.RegionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RegionSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    owner: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true },
});
exports.RegionModel = mongoose_1.default.model('Region', RegionSchema);
const getRegions = () => exports.RegionModel.find().populate('owner');
exports.getRegions = getRegions;
const getRegionById = (id) => exports.RegionModel.findById(id).populate('owner');
exports.getRegionById = getRegionById;
const createRegion = (values) => new exports.RegionModel(values).save().then(region => region.toObject());
exports.createRegion = createRegion;
const deleteRegionById = (id) => exports.RegionModel.findByIdAndDelete(id);
exports.deleteRegionById = deleteRegionById;
const updateRegionById = (id, values) => exports.RegionModel.findByIdAndUpdate(id, values);
exports.updateRegionById = updateRegionById;
const getRegionsByPoint = (point) => exports.RegionModel.find({
    coordinates: {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [point.longitude, point.latitude],
            },
        },
    },
}).populate('owner');
exports.getRegionsByPoint = getRegionsByPoint;
const getRegionsWithinDistance = (point, distance, filterUserRegions = false, userId) => {
    const filter = {
        coordinates: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                },
                $maxDistance: distance,
            },
        },
    };
    if (filterUserRegions && userId) {
        filter.owner = userId;
    }
    return exports.RegionModel.find(filter).populate('owner');
};
exports.getRegionsWithinDistance = getRegionsWithinDistance;
//# sourceMappingURL=regions.js.map