import {ByteInputBuffer} from "../net/ByteInputBuffer";

export abstract class BaseGameCfgManager {
    private _fileName : string;
    private _input: ByteInputBuffer;

    protected loadXdFileToDataInputStream(fileName: string ) : number {
        this.close();
        this._fileName = fileName;
        console.log(this._fileName)
        let file:File = new File(["ArrayBuffer"],this._fileName);
        console.log('读取配置文件[', fileName, "]");
        console.log(file.size);
        return 0;
    }

    public abstract init(): void;

    private close(){
    }
}