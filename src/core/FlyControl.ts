class FlyControl {
    private mainObj: egret.DisplayObjectContainer;

    private bitmapList: string[] = ["birds1_png", "birds2_png", "birds3_png"];

    private pipelineList: PipeLine[] = [];

    private index: number = 0;

    private bird: egret.Bitmap = null;
    // 当前高度
    private currentHeight: number = -1;
    // 坠落加速度
    private readonly ACCELERATED_SPEED: number = 10;
    // 单位距离
    private readonly UNIT: number = 20;
    // 地面所在高度
    private groundHeight: number = 0;
    // 上飞状态控制
    private isFlyingUp: boolean = false;
    // 飞行高度参照
    private flyReference = {
        y: 0
    };
    // 根据自由落体原理，通过时间间隔，计算下落距离。
    private t1: number = 0;
    private t2: number = 0;
    // 状态：0,normal; 1,failure
    public readonly STATE_NORMAL: number = 0;
    public readonly STATE_FAILURE: number = 1;
    private state: number = this.STATE_NORMAL;

    public constructor(mainObjContainer: egret.DisplayObjectContainer, options) {
        options = options || {};

        this.mainObj = mainObjContainer;
        this.groundHeight = options.groundHeight || mainObjContainer.stage.stageHeight * 0.75;

        let pipeLine1 = new PipeLine(mainObjContainer, {
            groundPos: this.groundHeight
        });
        let pipeLine2 = new PipeLine(mainObjContainer, {
            groundPos: this.groundHeight,
            xPos: this.mainObj.stage.stageWidth
        });
        this.pipelineList.push(pipeLine1);
        this.pipelineList.push(pipeLine2);
    }

    private initBird(): egret.Bitmap {
        return this.createBird(this.bitmapList[this.index]);
    }

    private createBird(resName: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(resName);
        result.texture = texture;
        result.x = this.mainObj.stage.stageWidth / 5;
        result.y = this.getHeight(result);
        result.scaleX = 2;
        result.scaleY = 2;

        // 飞起来时，旋转图片
        if (this.isFlyingUp) {
            result.rotation = -20;
        }

        return result;
    }

    private getHeight(obj: egret.Bitmap): number {
        if (this.isFlyingUp) {
            return this.currentHeight - this.flyReference.y;
        }

        if (this.bird != null) {
            let ct = new Date().getTime() / 1000;
            let T1 = this.t2 - this.t1;
            let T2 = ct - this.t1;
            let s = (Math.pow(T2, 2) - Math.pow(T1, 2)) * this.ACCELERATED_SPEED * this.UNIT;
            this.t2 = ct;

            this.currentHeight += s;
        } else {
            this.currentHeight = (this.mainObj.stage.stageHeight - obj.height) / 2;
        }

        let objHeight = obj.height * obj.scaleY;

        if (this.currentHeight + objHeight >= this.groundHeight) {
            this.state = this.STATE_FAILURE;
            this.currentHeight = this.groundHeight - objHeight;
        }

        return this.currentHeight;
    }

    /**
     * 初始化自由落体计算时间戳
     */
    private initInterval() {
        this.t1 = this.t2 = new Date().getTime() / 1000;
    }

    /**
     * 碰撞检测
     */
    private hitCheck(): boolean {
        if (this.bird) {
            let bounds = Utils.getBounds(this.bird);
            for (let index in this.pipelineList) {
                let pipeLine = this.pipelineList[index];
                // 碰撞检测
                if (pipeLine.hitCheck(bounds.topLeft) ||
                    pipeLine.hitCheck(bounds.topRight) ||
                    pipeLine.hitCheck(bounds.bottomLeft) ||
                    pipeLine.hitCheck(bounds.bottomRight)) {
                    
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 飞起来
     */
    public flyingUp() {
        if (this.state !== this.STATE_NORMAL) {
            return;
        }

        this.isFlyingUp = true;

        egret.Tween.removeTweens(this.flyReference);
        // 删除之后需要保存上次的最后位置，以便于下次缓动函数调用
        this.currentHeight -= this.flyReference.y;
        // 重置参照对象
        this.flyReference.y = 0;

        egret.Tween.get(this.flyReference)
        .to({y: this.mainObj.stage.stageHeight / 10}, 500, egret.Ease.quadOut)
        .call(() => {
            this.isFlyingUp = false;
            this.currentHeight -= this.flyReference.y;
            this.flyReference.y = 0; // 置0，防止重复做减法
            this.initInterval();
        });
    }

    public showFrame(): void {
        if (this.state !== this.STATE_NORMAL) {
            return;
        }

        if (this.hitCheck()) {
            this.state = this.STATE_FAILURE;
            return;
        }

        /**
         * 删除已消失管道,并移动其余管道。另外，每删除一个管道，需要在重新增加一个。
         */
        for (let index in this.pipelineList) {
            let pipeLine = this.pipelineList[index];
            
            if (!pipeLine.isVisible()) {
                pipeLine.remove();
                this.pipelineList.splice(parseInt(index), 1);

                let newPipeline = new PipeLine(this.mainObj, {
                    groundPos: this.groundHeight,
                    xPos: this.mainObj.stage.stageWidth
                });
                this.pipelineList.push(newPipeline);
            } else {
                pipeLine.showFrame();
            }
        }

        /**
         * 切换飞翔状态
         */
        if (this.bird != null) {
            this.index = (this.index + 1) % this.bitmapList.length;
            this.mainObj.removeChild(this.bird);
            this.bird = this.createBird(this.bitmapList[this.index]);
        } else {
            this.initInterval();
            this.bird = this.initBird();
            this.currentHeight = this.bird.y;
        }
        
        this.mainObj.addChild(this.bird);
    }

    public getState() {
        return this.state;
    }
}