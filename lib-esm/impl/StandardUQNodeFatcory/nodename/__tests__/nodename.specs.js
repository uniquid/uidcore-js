"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const nodename_1 = require("./../../nodename");
describe('nodename', () => {
    let storedNodename;
    const home = path.join(__dirname, 'home');
    beforeAll(() => {
        if (!fs.existsSync(home)) {
            fs.mkdirSync(home);
        }
        storedNodename = nodename_1.getNodeName({ home });
    });
    afterAll(() => {
        fs.unlinkSync(path.join(home, nodename_1.NODE_NAME_FILE));
    });
    it(`name should be ${nodename_1.NAME_LENGTH} long`, () => {
        expect(storedNodename.length).toBe(nodename_1.NAME_LENGTH);
    });
    it('should retrieve stored name', () => {
        const nodename = nodename_1.getNodeName({ home });
        expect(nodename).toBe(storedNodename);
    });
});
//# sourceMappingURL=nodename.specs.js.map