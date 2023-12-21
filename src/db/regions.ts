import mongoose from 'mongoose'

interface Region {
    name: string
    coordinates: { latitude: number; longitude: number }
    owner: mongoose.Types.ObjectId
}

const RegionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

export const RegionModel = mongoose.model('Region', RegionSchema)

export const getRegions = () => RegionModel.find().populate('owner')
export const getRegionById = (id: string) =>
    RegionModel.findById(id).populate('owner')
export const createRegion = (values: Region) =>
    new RegionModel(values).save().then(region => region.toObject())
export const deleteRegionById = (id: string) =>
    RegionModel.findByIdAndDelete(id)
export const updateRegionById = (id: string, values: Region) =>
    RegionModel.findByIdAndUpdate(id, values)

export const getRegionsByPoint = (point: {
    latitude: number
    longitude: number
}) =>
    RegionModel.find({
        coordinates: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                },
            },
        },
    }).populate('owner')

export const getRegionsWithinDistance = (
    point: { latitude: number; longitude: number },
    distance: number,
    filterUserRegions: boolean = false,
    userId?: mongoose.Types.ObjectId
) => {
    const filter: any = {
        coordinates: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [point.longitude, point.latitude],
                },
                $maxDistance: distance,
            },
        },
    }

    if (filterUserRegions && userId) {
        filter.owner = userId
    }

    return RegionModel.find(filter).populate('owner')
}
