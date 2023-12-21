"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const regions_1 = require("../controllers/regions");
exports.default = (router) => {
    router.get('/regions', regions_1.getAllRegions);
    router.post('/regions', regions_1.createRegion);
    router.delete('/regions/:id', regions_1.deleteRegion);
    router.patch('/regions/:id', regions_1.updateRegion);
};
//# sourceMappingURL=regions.js.map