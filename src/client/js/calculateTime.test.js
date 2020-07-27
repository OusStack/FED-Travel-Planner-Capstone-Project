const {
    calculateTime
} = require("./calculateTime");

describe("calculateTime() function", () => {
    test("should be defined", async () => {
        expect(calculateTime).toBeDefined();
    });
    test("should be a function",
        async () => {
            expect(typeof calculateTime).toBe("function");
        });
});