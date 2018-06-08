"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var nodename_1 = require("./../../nodename");
describe('nodename', function () {
    var storedNodename;
    var home = path.join(__dirname, 'home');
    beforeAll(function () {
        if (!fs.existsSync(home)) {
            fs.mkdirSync(home);
        }
        storedNodename = nodename_1.getNodeName({ home: home });
    });
    afterAll(function () {
        fs.unlinkSync(path.join(home, nodename_1.NODE_NAME_FILE));
    });
    it("name should be " + nodename_1.NAME_LENGTH + " long", function () {
        expect(storedNodename.length).toBe(nodename_1.NAME_LENGTH);
    });
    it('should retrieve stored name', function () {
        var nodename = nodename_1.getNodeName({ home: home });
        expect(nodename).toBe(storedNodename);
    });
});
//# sourceMappingURL=nodename.specs.js.map