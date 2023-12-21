import { exportRegionsToCsv, exportUsersToCsv } from '../db/exportToCsv'
import express from 'express'

export default (router: express.Router) => {
    router.get('/export/regions', async (req, res) => {
        try {
            console.log('Exporting regions...')
            const filePath = await exportRegionsToCsv()

            res.setHeader(
                'Content-Disposition',
                `attachment; filename=regions.csv`
            )
            res.setHeader('Content-Type', 'text/csv')

            res.sendFile(filePath, err => {
                if (err) {
                    console.log('Error sending file:', err)
                    res.status(500).send('Internal Server Error')
                } else {
                    console.log('File sent successfully')
                }
            })
        } catch (error) {
            console.log('Error exporting regions:', error)
            res.status(500).send('Internal Server Error')
        }
    })

    router.get('/export/users', async (req, res) => {
        try {
            console.log('Exporting users...')
            const filePath = await exportUsersToCsv()

            res.setHeader(
                'Content-Disposition',
                `attachment; filename=users.csv`
            )
            res.setHeader('Content-Type', 'text/csv')

            res.sendFile(filePath, err => {
                if (err) {
                    console.log('Error sending file:', err)
                    res.status(500).send('Internal Server Error')
                } else {
                    console.log('File sent successfully')
                }
            })
        } catch (error) {
            console.log('Error exporting users:', error)
            res.status(500).send('Internal Server Error')
        }
    })
}
