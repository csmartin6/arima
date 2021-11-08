/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { readFileSync } from "fs-extra";
import { getArimaComputer } from "../../index";

function testData(): number[] {
    const file = readFileSync("resources/data/S4248SM144NCEN.txt", "utf-8");
    const numbers = file.split("\n").map(Number.parseFloat);
    return numbers.slice(numbers.length - 154, numbers.length - 2);
}

const verbose = false;

describe("Dummy Tests", () => {
    test("Sarimax Simple", async () => {
        const ts = testData();
        const arima = await getArimaComputer();
        const compiledModel = await arima.fit(
            {
                p: 2,
                d: 0,
                q: 1,
                verbose,
            },
            ts,
            [],
        );
        const [pred, errors] = arima.predict(compiledModel, 12, []);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Sarimax Seasonal", async () => {
        const ts = testData();
        const arima = await getArimaComputer();
        const compiledModel = await arima.fit(
            {
                p: 2,
                d: 1,
                q: 1,
                P: 2,
                D: 1,
                Q: 1,
                s: 12,
                verbose,
            },
            ts,
            [],
        );
        const [pred, errors] = arima.predict(compiledModel, 12, []);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Auto Arima", async () => {
        const ts = testData();
        const arima = await getArimaComputer();
        const compiledModel = await arima.fit(
            {
                p: 5,
                d: 2,
                q: 5,
                verbose,
                auto: true,
            },
            ts,
            [],
        );
        const [pred, errors] = arima.predict(compiledModel, 12, []);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });

    test("Auto Arima Seasonal", async () => {
        const ts = testData();
        const arima = await getArimaComputer();

        const compiledModel = await arima.fit(
            {
                p: 5,
                d: 2,
                q: 5,
                P: 2,
                D: 1,
                Q: 2,
                s: 12,
                verbose,
                auto: true,
            },
            ts,
            [],
        );
        const [pred, errors] = arima.predict(compiledModel, 12, []);
        expect(pred.length).toEqual(12);
        expect(errors.length).toEqual(12);
    });
});
