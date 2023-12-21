import express from 'express'

import {
    createRegion,
    deleteRegion,
    getAllRegions,
    updateRegion,
} from '../controllers/regions'

export default (router: express.Router) => {
    router.get('/regions', getAllRegions)
    router.post('/regions', createRegion)
    router.delete('/regions/:id', deleteRegion)
    router.patch('/regions/:id', updateRegion)
}
