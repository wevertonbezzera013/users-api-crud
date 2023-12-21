import express from 'express'

import authentication from './authentication'
import users from './users'
import regions from './regions'
import exportToCsv from './exportToCsv'

const router = express.Router()

export default (): express.Router => {
    authentication(router)
    users(router)
    regions(router)
    exportToCsv(router)

    return router
}
