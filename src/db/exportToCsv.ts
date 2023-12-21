// import statements...

const fs = require('fs')
const path = require('path')
import console from 'console'
import { getRegions } from './regions'
import { getUsers } from './users'
import { json2csv, Json2CsvOptions } from 'json-2-csv'

const regionCsvPath = path.join(__dirname, 'regions.csv')
const userCsvPath = path.join(__dirname, 'users.csv')

export const exportRegionsToCsv = async (): Promise<string> => {
    try {
        const regions = await getRegions()
        console.log('Original Regions data:', regions)

        const simplifiedRegions = regions.map(region => ({
            name: region.name,
            latitude: region.coordinates?.latitude ?? null,
            longitude: region.coordinates?.longitude ?? null,
        }))
        console.log('Simplified Regions data:', simplifiedRegions)

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
        console.log('Regions exported to CSV')

        return regionCsvPath
    } catch (error) {
        console.log('Error exporting regions to CSV:', error)
        throw error
    }
}

export const exportUsersToCsv = async (): Promise<string> => {
    try {
        const users = await getUsers()
        console.log('Original Users data:', users)

        const simplifiedUsers = users.map(user => ({
            username: user.username,
            email: user.email,
            latitude: user.coordinates?.latitude ?? null,
            longitude: user.coordinates?.longitude ?? null,
        }))
        console.log('Simplified Users data:', simplifiedUsers)

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
        console.log('Users exported to CSV')

        return userCsvPath
    } catch (error) {
        console.log('Error exporting users to CSV:', error)
        throw error
    }
}
