import express from 'express'
import { RegionModel, deleteRegionById, getRegionById } from '../db/regions'

export const getAllRegions = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        console.log('Received GET request for /regions')
        const regions = await getAllRegionsIncludingDeleted()
        console.log('Sending response:', regions)
        return res.status(200).json(regions)
    } catch (error) {
        console.log('Error processing GET request for /regions:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getAllRegionsIncludingDeleted = () => {
    return RegionModel.find()
}

export const createRegion = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, coordinates, owner } = req.body

        if (!name || !coordinates || !owner) {
            console.log('Missing required fields for creating a region')
            return res.status(400).json({
                error: 'Name, coordinates, and owner are required to create a region',
            })
        }

        const newRegion = await RegionModel.create({
            name,
            coordinates,
            owner,
        })

        console.log(`Region created: ${newRegion._id}`)
        return res.status(201).json(newRegion)
    } catch (error) {
        console.log('Error in createRegion:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteRegion = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const deletedRegion = await deleteRegionById(id)

        if (!deletedRegion) {
            console.log(`Region not found with id: ${id}`)
            return res.status(404).json({ error: 'Region not found' })
        }

        console.log(`Region deleted: ${deletedRegion._id}`)
        return res.json(deletedRegion)
    } catch (error) {
        console.log('Error in deleteRegion:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const updateRegion = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const { name, coordinates } = req.body

        if (!name && !coordinates) {
            console.log(
                'At least one field (name or coordinates) is required for update'
            )
            return res.status(400).json({
                error: 'At least one field (name or coordinates) is required for update',
            })
        }

        const region = await getRegionById(id)

        if (!region) {
            console.log(`Region not found with id: ${id}`)
            return res.status(404).json({ error: 'Region not found' })
        }

        if (name) {
            region.name = name
        }

        if (coordinates) {
            region.coordinates = coordinates
        }

        await region.save()

        console.log(`Region updated: ${region._id}`)
        return res.status(200).json(region).end()
    } catch (error) {
        console.log('Error in updateRegion:', error)
        return res.sendStatus(500)
    }
}
