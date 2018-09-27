var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PipeLine = (function () {
    function PipeLine(mainObjContainer, option) {
        // 移动速度 单位：像素/每帧
        this.speed = 3;
        this.mainObj = mainObjContainer;
        var xPos = option.xPos || this.mainObj.stage.stageWidth / 2;
        this.pipelineUp = this.createPipeLine("pipeline1_png", xPos);
        var pluHeight = this.generatePipeHeight(this.pipelineUp.height);
        this.pipelineUp.y = pluHeight - this.pipelineUp.height;
        this.pipelineDown = this.createPipeLine("pipeline2_png", xPos);
        var pldHeight = this.generatePipeHeight(this.pipelineUp.height);
        this.pipelineDown.y = option.groundPos - pldHeight;
        this.pipelineDown.height = pldHeight;
        this.mainObj.addChild(this.pipelineUp);
        this.mainObj.addChild(this.pipelineDown);
    }
    PipeLine.prototype.showFrame = function () {
        this.pipelineUp.x -= this.speed;
        this.pipelineDown.x -= this.speed;
    };
    /**
     * 判断是否可见，若不可见，则被删除
     */
    PipeLine.prototype.isVisible = function () {
        return this.pipelineUp.x + this.pipelineUp.width > 0 ? true : false;
    };
    PipeLine.prototype.remove = function () {
        this.mainObj.removeChild(this.pipelineUp);
        this.mainObj.removeChild(this.pipelineDown);
    };
    PipeLine.prototype.hitCheck = function (point) {
        return this.pipelineUp.hitTestPoint(point.x, point.y) || this.pipelineDown.hitTestPoint(point.x, point.y);
    };
    /**
     * 创建管道
     */
    PipeLine.prototype.createPipeLine = function (resName, x) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.fillMode = egret.BitmapFillMode.CLIP;
        result.texture = texture;
        result.x = x;
        return result;
    };
    /**
     * 随机产生管道的高度和位置
     */
    PipeLine.prototype.generatePipeHeight = function (maxHeight) {
        var min = 0.7;
        var max = 0.9;
        return maxHeight * (Math.random() * (max - min) + min);
    };
    return PipeLine;
}());
__reflect(PipeLine.prototype, "PipeLine");
//# sourceMappingURL=PipeLine.js.map