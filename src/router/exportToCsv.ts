import { exportRegionsToCsv, exportUsersToCsv } from '../db/exportToCsv'
import express from 'express'
import logger from '../logger'

export default (router: express.Router) => {
    router.get('/export/regions', async (req, res) => {
        try {
            logger.info('Exporting regions...')
            const filePath = await exportRegionsToCsv()

            res.setHeader(
                'Content-Disposition',
                `attachment; filename=regions.csv`
            )
            res.setHeader('Content-Type', 'text/csv')

            res.sendFile(filePath, err => {
                if (err) {
                    logger.error('Error sending file:', err)
                    res.status(500).send('Internal Server Error')
                } else {
                    logger.info('File sent successfully')
                }
            })
        } catch (error) {
            logger.error('Error exporting regions:', error)
            res.status(500).send('Internal Server Error')
        }
    })

    router.get('/export/users', async (req, res) => {
        try {
            logger.info('Exporting users...')
            const filePath = await exportUsersToCsv()

            res.setHeader(
                'Content-Disposition',
                `attachment; filename=users.csv`
            )
            res.setHeader('Content-Type', 'text/csv')

            res.sendFile(filePath, err => {
                if (err) {
                    logger.error('Error sending file:', err)
                    res.status(500).send('Internal Server Error')
                } else {
                    logger.info('File sent successfully')
                }
            })
        } catch (error) {
            logger.error('Error exporting users:', error)
            res.status(500).send('Internal Server Error')
        }
    })
}
