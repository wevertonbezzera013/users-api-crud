"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exportToCsv_1 = require("../db/exportToCsv");
exports.default = (router) => {
    router.get('/export/regions', async (req, res) => {
        try {
            console.log('Exporting regions...');
            const filePath = await (0, exportToCsv_1.exportRegionsToCsv)();
            res.setHeader('Content-Disposition', `attachment; filename=regions.csv`);
            res.setHeader('Content-Type', 'text/csv');
            res.sendFile(filePath, err => {
                if (err) {
                    console.log('Error sending file:', err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    console.log('File sent successfully');
                }
            });
        }
        catch (error) {
            console.log('Error exporting regions:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    router.get('/export/users', async (req, res) => {
        try {
            console.log('Exporting users...');
            const filePath = await (0, exportToCsv_1.exportUsersToCsv)();
            res.setHeader('Content-Disposition', `attachment; filename=users.csv`);
            res.setHeader('Content-Type', 'text/csv');
            res.sendFile(filePath, err => {
                if (err) {
                    console.log('Error sending file:', err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    console.log('File sent successfully');
                }
            });
        }
        catch (error) {
            console.log('Error exporting users:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};
//# sourceMappingURL=exportToCsv.js.map