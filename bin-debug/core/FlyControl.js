var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FlyControl = (function () {
    function FlyControl(mainObjContainer, options) {
        this.bitmapList = ["birds1_png", "birds2_png", "birds3_png"];
        this.pipelineList = [];
        this.index = 0;
        this.bird = null;
        // 当前高度
        this.currentHeight = -1;
        // 坠落加速度
        this.ACCELERATED_SPEED = 10;
        // 单位距离
        this.UNIT = 20;
        // 地面所在高度
        this.groundHeight = 0;
        // 上飞状态控制
        this.isFlyingUp = false;
        // 飞行高度参照
        this.flyReference = {
            y: 0
        };
        // 根据自由落体原理，通过时间间隔，计算下落距离。
        this.t1 = 0;
        this.t2 = 0;
        // 状态：0,normal; 1,failure
        this.STATE_NORMAL = 0;
        this.STATE_FAILURE = 1;
        this.state = this.STATE_NORMAL;
        options = options || {};
        this.mainObj = mainObjContainer;
        this.groundHeight = options.groundHeight || mainObjContainer.stage.stageHeight * 0.75;
        var pipeLine1 = new PipeLine(mainObjContainer, {
            groundPos: this.groundHeight
        });
        var pipeLine2 = new PipeLine(mainObjContainer, {
            groundPos: this.groundHeight,
            xPos: this.mainObj.stage.stageWidth
        });
        this.pipelineList.push(pipeLine1);
        this.pipelineList.push(pipeLine2);
    }
    FlyControl.prototype.initBird = function () {
        return this.createBird(this.bitmapList[this.index]);
    };
    FlyControl.prototype.createBird = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
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
    };
    FlyControl.prototype.getHeight = function (obj) {
        if (this.isFlyingUp) {
            return this.currentHeight - this.flyReference.y;
        }
        if (this.bird != null) {
            var ct = new Date().getTime() / 1000;
            var T1 = this.t2 - this.t1;
            var T2 = ct - this.t1;
            var s = (Math.pow(T2, 2) - Math.pow(T1, 2)) * this.ACCELERATED_SPEED * this.UNIT;
            this.t2 = ct;
            this.currentHeight += s;
        }
        else {
            this.currentHeight = (this.mainObj.stage.stageHeight - obj.height) / 2;
        }
        var objHeight = obj.height * obj.scaleY;
        if (this.currentHeight + objHeight >= this.groundHeight) {
            this.state = this.STATE_FAILURE;
            this.currentHeight = this.groundHeight - objHeight;
        }
        return this.currentHeight;
    };
    /**
     * 初始化自由落体计算时间戳
     */
    FlyControl.prototype.initInterval = function () {
        this.t1 = this.t2 = new Date().getTime() / 1000;
    };
    /**
     * 碰撞检测
     */
    FlyControl.prototype.hitCheck = function () {
        if (this.bird) {
            var bounds = Utils.getBounds(this.bird);
            for (var index in this.pipelineList) {
                var pipeLine = this.pipelineList[index];
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
    };
    /**
     * 飞起来
     */
    FlyControl.prototype.flyingUp = function () {
        var _this = this;
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
            .to({ y: this.mainObj.stage.stageHeight / 10 }, 500, egret.Ease.quadOut)
            .call(function () {
            _this.isFlyingUp = false;
            _this.currentHeight -= _this.flyReference.y;
            _this.flyReference.y = 0; // 置0，防止重复做减法
            _this.initInterval();
        });
    };
    FlyControl.prototype.showFrame = function () {
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
        for (var index in this.pipelineList) {
            var pipeLine = this.pipelineList[index];
            if (!pipeLine.isVisible()) {
                pipeLine.remove();
                this.pipelineList.splice(parseInt(index), 1);
                var newPipeline = new PipeLine(this.mainObj, {
                    groundPos: this.groundHeight,
                    xPos: this.mainObj.stage.stageWidth
                });
                this.pipelineList.push(newPipeline);
            }
            else {
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
        }
        else {
            this.initInterval();
            this.bird = this.initBird();
            this.currentHeight = this.bird.y;
        }
        this.mainObj.addChild(this.bird);
    };
    FlyControl.prototype.getState = function () {
        return this.state;
    };
    return FlyControl;
}());
__reflect(FlyControl.prototype, "FlyControl");
//# sourceMappingURL=FlyControl.js.map