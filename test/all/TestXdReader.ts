import {BaseGameCfgManager} from "../../src/config/BaseGameCfgManager";
import * as path from "path";

export class TestXdReader extends BaseGameCfgManager {

    init(): void {
        console.log(super.loadXdFileToDataInputStream("../resources/duihuan_data.xd"))

    }
}

new TestXdReader().init();