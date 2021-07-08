/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { getArima } from "../index";

function add(x: number, y:number ) {
    const z = x + y;
    return z;
}

async function predictUsingArima() {
    const ts = Array(24)
        .fill(0)
        .map((_, i) => i + Math.random() / 5);

    // Init arima and start training
    const arima = await getArima({
        p: 2,
        d: 1,
        q: 2,
        verbose: false,
    });
    // const fittedArima = arima.fit(ts, Array.from([Array.from([])]));
    const fittedArima = arima.fit(ts);
    console.log("fitterModel:", fittedArima.model)
    // Predict next 12 values
    const [pred, errors] = fittedArima.predict(12);
    // eslint-disable-next-line no-console
    console.log("errors: ", errors);
    return pred;
}

describe("Dummy Tests", () => {
    test("Add", () => {
        expect(add(0, 1)).toEqual(1);
    });
    test("Construct Arima", async () => {

        const predictions = await predictUsingArima();
        expect(predictions.length).toEqual(12);
    });
});
