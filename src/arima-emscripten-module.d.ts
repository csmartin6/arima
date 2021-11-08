/*!
 * (c) Copyright 2021 Palantir Technologies Inc. All rights reserved.
 */

import { ArimaEmscriptenModule } from "./emscripten-types";
declare function Module(): Promise<ArimaEmscriptenModule>;
export default Module;
