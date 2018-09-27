class PipeLine {
    
    private mainObj: egret.DisplayObjectContainer;

    private pipelineUp: egret.Bitmap;
    private pipelineDown: egret.Bitmap;
    // 移动速度 单位：像素/每帧
    private speed: number = 3;

    public constructor(mainObjContainer: egret.DisplayObjectContainer, option) {
        this.mainObj = mainObjContainer;

        let xPos = option.xPos || this.mainObj.stage.stageWidth / 2;

        this.pipelineUp = this.createPipeLine("pipeline1_png", xPos);
        let pluHeight = this.generatePipeHeight(this.pipelineUp.height);
        this.pipelineUp.y = pluHeight - this.pipelineUp.height;
        
        this.pipelineDown = this.createPipeLine("pipeline2_png", xPos);
        let pldHeight = this.generatePipeHeight(this.pipelineUp.height);
        this.pipelineDown.y = option.groundPos - pldHeight;
        this.pipelineDown.height = pldHeight;

        this.mainObj.addChild(this.pipelineUp);
        this.mainObj.addChild(this.pipelineDown);
    }

    public showFrame(): void {
        this.pipelineUp.x -= this.speed;
        this.pipelineDown.x -= this.speed;
    }

    /**
     * 判断是否可见，若不可见，则被删除
     */
    public isVisible(): boolean {
        return this.pipelineUp.x + this.pipelineUp.width > 0 ? true : false;
    }

    public  remove() {
        this.mainObj.removeChild(this.pipelineUp);
        this.mainObj.removeChild(this.pipelineDown);
    }

    public hitCheck(point: Point) {
        return this.pipelineUp.hitTestPoint(point.x, point.y) || this.pipelineDown.hitTestPoint(point.x, point.y);
    }

    /**
     * 创建管道
     */
    private createPipeLine(resName: string, x: number): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(resName);
        result.fillMode = egret.BitmapFillMode.CLIP;
        result.texture = texture;
        result.x = x;

        return result;
    }

    /**
     * 随机产生管道的高度和位置
     */
    private generatePipeHeight(maxHeight): number {
        let min = 0.7;
        let max = 0.9;

        return maxHeight * (Math.random() * (max - min) + min);
    }
}
