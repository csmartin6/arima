/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { getArima } from "../index";
import { readFileSync } from 'fs';


function testData(): number[] {
    const file = readFileSync('src/api/data/S4248SM144NCEN.txt', 'utf-8');
    const numbers =  file.split("\n").map(Number.parseFloat)
    return numbers.slice(200, numbers.length - 20); // numbers.length - 12)
    // return [9225, 9948, 8758, 10839, 7266, 7578, 8688, 9162, 9369, 10167, 9507, 8923, 9272, 90175, 8949, 10843, 6558, 7481, 9475, 9424, 9351, 10552, 9077, 9273, 9420];
}

 describe("Dummy Tests", () => {
    test("Sarimax Simple" , async () => {
        const ts = testData();
        const arima = await getArima({
            p: 2,
            d: 0,
            q: 1,
            verbose: true,
        });

        const fittedArima = await arima.fit(ts);
        const [pred, errors] = fittedArima.predict(12);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Sarimax Seasonal", async () => {
        const ts = testData();
        const arima = await getArima({
            p: 0,
            d: 1,
            q: 1,
            P: 2,
            D: 1,
            Q: 1,
            s: 12,
            verbose: true,
        });

        const fittedArima = await arima.fit(ts);
        const [pred, errors] = fittedArima.predict(12);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Auto Arima", async () => {
        const ts = testData();
        const arima = await getArima({
            p: 5,
            d: 2,
            q: 5,
            verbose: true,
            auto: true,
        });

        const fittedArima = await arima.fit(ts);
        const [pred, errors] = fittedArima.predict(12);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Auto Arima Seasonal", async () => {
        const ts = testData();
        const arima = await getArima({
            p: 5,
            d: 2,
            q: 5,
            P: 2,
            D: 1,
            Q: 2,
            s: 12,
            verbose: true,
            auto: true,
        });

        const fittedArima = await arima.fit(ts);
        const [pred, errors] = fittedArima.predict(12);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });
});
