// import statements...

const fs = require('fs')
const path = require('path')
import { getRegions } from './regions'
import { getUsers } from './users'
import { json2csv, Json2CsvOptions } from 'json-2-csv'
import logger from '../logger'

const regionCsvPath = path.join(__dirname, 'regions.csv')
const userCsvPath = path.join(__dirname, 'users.csv')

export const exportRegionsToCsv = async (): Promise<string> => {
    try {
        const regions = await getRegions()
        logger.info('Original Regions data:', regions)

        const simplifiedRegions = regions.map(region => ({
            name: region.name,
            latitude: region.coordinates?.latitude ?? null,
            longitude: region.coordinates?.longitude ?? null,
        }))
        logger.info('Simplified Regions data:', simplifiedRegions)

        const csv = await json2csv(simplifiedRegions, {
            checkSchemaDifferences: false,
            parseValue: (
                fieldValue: unknown,
                defaultParser: (fieldValue: unknown) => string
            ): string => {
                if (fieldValue instanceof Date) {
                    return fieldValue.toISOString()
                }
                return defaultParser(fieldValue)
            },
        } as Json2CsvOptions)

        fs.writeFileSync(regionCsvPath, csv)
        logger.info('Regions exported to CSV')

        return regionCsvPath
    } catch (error) {
        logger.error('Error exporting regions to CSV:', error)
        throw error
    }
}

export const exportUsersToCsv = async (): Promise<string> => {
    try {
        const users = await getUsers()
        logger.info('Original Users data:', users)

        const simplifiedUsers = users.map(user => ({
            username: user.username,
            email: user.email,
            latitude: user.coordinates?.latitude ?? null,
            longitude: user.coordinates?.longitude ?? null,
        }))
        logger.info('Simplified Users data:', simplifiedUsers)

        const csv = await json2csv(simplifiedUsers, {
            checkSchemaDifferences: false,
            parseValue: (
                fieldValue: unknown,
                defaultParser: (fieldValue: unknown) => string
            ): string => {
                if (fieldValue instanceof Date) {
                    return fieldValue.toISOString()
                }
                return defaultParser(fieldValue)
            },
        } as Json2CsvOptions)

        fs.writeFileSync(userCsvPath, csv)
        logger.info('Users exported to CSV')

        return userCsvPath
    } catch (error) {
        logger.error('Error exporting users to CSV:', error)
        throw error
    }
}
