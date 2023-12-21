"use strict";
// import statements...
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportUsersToCsv = exports.exportRegionsToCsv = void 0;
const fs = require('fs');
const path = require('path');
const console_1 = __importDefault(require("console"));
const regions_1 = require("./regions");
const users_1 = require("./users");
const json_2_csv_1 = require("json-2-csv");
const regionCsvPath = path.join(__dirname, 'regions.csv');
const userCsvPath = path.join(__dirname, 'users.csv');
const exportRegionsToCsv = async () => {
    try {
        const regions = await (0, regions_1.getRegions)();
        console_1.default.log('Original Regions data:', regions);
        const simplifiedRegions = regions.map(region => ({
            name: region.name,
            latitude: region.coordinates?.latitude ?? null,
            longitude: region.coordinates?.longitude ?? null,
        }));
        console_1.default.log('Simplified Regions data:', simplifiedRegions);
        const csv = await (0, json_2_csv_1.json2csv)(simplifiedRegions, {
            checkSchemaDifferences: false,
            parseValue: (fieldValue, defaultParser) => {
                if (fieldValue instanceof Date) {
                    return fieldValue.toISOString();
                }
                return defaultParser(fieldValue);
            },
        });
        fs.writeFileSync(regionCsvPath, csv);
        console_1.default.log('Regions exported to CSV');
        return regionCsvPath;
    }
    catch (error) {
        console_1.default.log('Error exporting regions to CSV:', error);
        throw error;
    }
};
exports.exportRegionsToCsv = exportRegionsToCsv;
const exportUsersToCsv = async () => {
    try {
        const users = await (0, users_1.getUsers)();
        console_1.default.log('Original Users data:', users);
        const simplifiedUsers = users.map(user => ({
            username: user.username,
            email: user.email,
            latitude: user.coordinates?.latitude ?? null,
            longitude: user.coordinates?.longitude ?? null,
        }));
        console_1.default.log('Simplified Users data:', simplifiedUsers);
        const csv = await (0, json_2_csv_1.json2csv)(simplifiedUsers, {
            checkSchemaDifferences: false,
            parseValue: (fieldValue, defaultParser) => {
                if (fieldValue instanceof Date) {
                    return fieldValue.toISOString();
                }
                return defaultParser(fieldValue);
            },
        });
        fs.writeFileSync(userCsvPath, csv);
        console_1.default.log('Users exported to CSV');
        return userCsvPath;
    }
    catch (error) {
        console_1.default.log('Error exporting users to CSV:', error);
        throw error;
    }
};
exports.exportUsersToCsv = exportUsersToCsv;
//# sourceMappingURL=exportToCsv.js.map