import {BaseGameCfgManager} from "../src/config/BaseGameCfgManager";
import * as path from "path";

export class TestXdReader extends BaseGameCfgManager {

    init(): void {
        console.log(super.loadXdFileToDataInputStream(__dirname+path.sep+"duihuan_data.xd"))

    }
}

new TestXdReader().init();