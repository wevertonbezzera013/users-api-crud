"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRegion = exports.deleteRegion = exports.createRegion = exports.getAllRegionsIncludingDeleted = exports.getAllRegions = void 0;
const regions_1 = require("../db/regions");
const getAllRegions = async (req, res) => {
    try {
        console.log('Received GET request for /regions');
        const regions = await (0, exports.getAllRegionsIncludingDeleted)();
        console.log('Sending response:', regions);
        return res.status(200).json(regions);
    }
    catch (error) {
        console.log('Error processing GET request for /regions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAllRegions = getAllRegions;
const getAllRegionsIncludingDeleted = () => {
    return regions_1.RegionModel.find();
};
exports.getAllRegionsIncludingDeleted = getAllRegionsIncludingDeleted;
const createRegion = async (req, res) => {
    try {
        const { name, coordinates, owner } = req.body;
        if (!name || !coordinates || !owner) {
            console.log('Missing required fields for creating a region');
            return res.status(400).json({
                error: 'Name, coordinates, and owner are required to create a region',
            });
        }
        const newRegion = await regions_1.RegionModel.create({
            name,
            coordinates,
            owner,
        });
        console.log(`Region created: ${newRegion._id}`);
        return res.status(201).json(newRegion);
    }
    catch (error) {
        console.log('Error in createRegion:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createRegion = createRegion;
const deleteRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRegion = await (0, regions_1.deleteRegionById)(id);
        if (!deletedRegion) {
            console.log(`Region not found with id: ${id}`);
            return res.status(404).json({ error: 'Region not found' });
        }
        console.log(`Region deleted: ${deletedRegion._id}`);
        return res.json(deletedRegion);
    }
    catch (error) {
        console.log('Error in deleteRegion:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteRegion = deleteRegion;
const updateRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, coordinates } = req.body;
        if (!name && !coordinates) {
            console.log('At least one field (name or coordinates) is required for update');
            return res.status(400).json({
                error: 'At least one field (name or coordinates) is required for update',
            });
        }
        const region = await (0, regions_1.getRegionById)(id);
        if (!region) {
            console.log(`Region not found with id: ${id}`);
            return res.status(404).json({ error: 'Region not found' });
        }
        if (name) {
            region.name = name;
        }
        if (coordinates) {
            region.coordinates = coordinates;
        }
        await region.save();
        console.log(`Region updated: ${region._id}`);
        return res.status(200).json(region).end();
    }
    catch (error) {
        console.log('Error in updateRegion:', error);
        return res.sendStatus(500);
    }
};
exports.updateRegion = updateRegion;
//# sourceMappingURL=regions.js.map