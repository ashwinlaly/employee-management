var request = require("supertest");
var app = require("../index");

describe("GET /", function() {
    it("respond with INVALID URL", function(done) {
    request(app).get("/").expect('{"message":"INVALID URL","code":404}', done);
    });
});