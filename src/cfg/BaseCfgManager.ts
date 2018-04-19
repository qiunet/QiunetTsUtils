import {ByteInputBuffer} from "../net/ByteInputBuffer";
import {ArrayList} from "../collection/ArrayList";
import {Map} from "../collection/Map";
import {CommonUtil} from "../utils/CommonUtil";
/***
 * 解析父类
 *
 * 例子参考:
 * https://github.com/qiunet/CocosCreatorAndServer/tree/master/MyGame/assets/Scripts/cfg/BaseGameCfgManager.ts
 * https://github.com/qiunet/CocosCreatorAndServer/tree/master/MyGame/assets/Scripts/cfg/InitManager.ts
 * https://github.com/qiunet/CocosCreatorAndServer/tree/master/MyGame/assets/Scripts/cfg/SkillManager.ts
 */
export abstract class BaseCfgManager {
    constructor(){
        // 初始化
        this.init();
    }

    /***加载自己的数据xd*/
    protected abstract init(): void;
    /**
     * 子类提供loader
     * 返回解析filename的方法. 以及转换字符or  Uint8Array
     * 返回的function 需要包含参数 (fileName:string, callback: Function)
     */
    protected abstract loader():(fileName:string, callback:(dis: ByteInputBuffer) => void)=>void;
    /**
     * 加载某个xd 并返回设定的行数
     * @param fileName  资源文件名称
     * @param callback 解析数据的callback ,function 需要包含参数 (dis:ByteInputBuffer)
     */
    protected loadXdFileToByteInputBuffer(fileName: string, callback:(dis: ByteInputBuffer) => void){
        let func = this.loader();
        func(fileName, callback);
    }
    /**
     * 子类完成加载后, 把转换string 或者 Uint8array 传入..
     *
     * @param resource 转换后的数据.  ArrayBuffer
     * @param callback 解析数据的callback ,function 需要包含参数 (dis:ByteInputBuffer)
     */
    protected completeLoader(resource: ArrayBuffer, callback:(dis: ByteInputBuffer) => void){
        callback.call(this, new ByteInputBuffer(resource));
    }


    /**
     * 得到简单的一个list数据.
     * 数据格式: List<cfg>
     * @param dis
     * @param cfgClass 你写的数据类. 负责读取的.
     */
    protected getSimpleListCfg<cfg>(dis: ByteInputBuffer, cfgClass:{new (dis: ByteInputBuffer): cfg}): ArrayList<cfg>{
        let list:ArrayList<cfg> = new ArrayList();
        let num: number = dis.readInt();
        for (var i = 0; i < num; i++) {
            let cfgData:cfg = new cfgClass(dis);
            list.add(cfgData);
        }
        return list;
    }
    /**
     * 得到简单的一个map数据.
     * 数据格式: Map<key: number, val: cfg>
     * @param dis
     * @param cfgClass 你写的数据类. 负责读取的.
     */
    protected getSimpleMapCfg<key extends number|string, cfg extends ISimpleMapCfg<key>>(dis: ByteInputBuffer, cfgClass:{new (dis: ByteInputBuffer): cfg}): Map<key, cfg>{
        let cfgMap: Map<key, cfg> = null;
        let num:number = dis.readInt();
        for (var i = 0; i < num; i++) {
            let cfgData:cfg = new cfgClass(dis);

            if (CommonUtil.isNullOrUndefined(cfgMap)) {
                cfgMap = CommonUtil.createMap(CommonUtil.isNumber(cfgData.getKey()));
            }

            cfgMap.put(cfgData.getKey(), cfgData);
        }
        return cfgMap;
    }

    /**
     * 得到嵌套map的一个map数据.
     * 数据格式: Map<key, Map< subKey, cfg>>
     * @param dis
     * @param cfgClass 你写的数据类. 负责读取的.
     */
    protected getNestMapCfg
    <key extends number|string,
        subKey extends number|string,
        cfg extends INestMapCfg<key, subKey>>
    (dis: ByteInputBuffer, cfgClass:{new (dis: ByteInputBuffer): cfg}): Map<key, Map<subKey,cfg>>{
        let cfgMap: Map<key, Map<subKey,cfg>> = null;
        let num:number = dis.readInt();
        for (var i = 0; i < num; i++) {
            let cfgData:cfg = new cfgClass(dis);

            if (CommonUtil.isNullOrUndefined(cfgMap)) {
                cfgMap = CommonUtil.createMap(CommonUtil.isNumber(cfgData.getKey()));
            }

            let subMap: Map<subKey, cfg> = cfgMap.get(cfgData.getKey());
            if (CommonUtil.isNullOrUndefined(subMap)) {
                subMap = CommonUtil.createMap(CommonUtil.isNumber(cfgData.getSubKey()));
                cfgMap.put(cfgData.getKey(), subMap);
            }

            subMap.put(cfgData.getSubKey(), cfgData);
        }
        return cfgMap;
    }
    /**
     * 得到嵌套list的一个map数据.
     * 数据格式: Map<key, ArrayList<cfg>>
     * @param dis
     * @param cfgClass 你写的数据类. 负责读取的.
     */
    protected getNestListCfg
    <key extends number|string,
        cfg extends INestListCfg<key>>
    (dis: ByteInputBuffer, cfgClass:{new (dis: ByteInputBuffer): cfg}): Map<key, ArrayList<cfg>> {
        let cfgMap:Map<key, ArrayList<cfg>> = null;
        let num:number = dis.readInt();
        for (var i = 0; i < num; i++) {
            let cfgData:cfg = new cfgClass(dis);

            if (CommonUtil.isNullOrUndefined(cfgMap)) {
                cfgMap = CommonUtil.createMap(CommonUtil.isNumber(cfgData.getKey()));
            }

            if (! cfgMap.containsKey(cfgData.getKey())) {
                cfgMap.put(cfgData.getKey(), new ArrayList<cfg>());
            }

            cfgMap.get(cfgData.getKey()).add(cfgData);
        }
        return cfgMap;
    }
}

export interface ISimpleMapCfg<key extends number|string>{
    /**
     * 某个类的key 如果按照map存储.
     */
    getKey(): key;
}
export interface INestListCfg<key extends number|string>{
    /**
     * 某个类的key 如果按照map存储.
     */
    getKey(): key;
}
export interface INestMapCfg<key extends number|string, subMapKey extends number|string>{
    /**
     * 某个类的key 如果按照map存储.
     */
    getKey(): key;
    /**
     * 得到里面map的key
     */
    getSubKey(): subMapKey;
}
