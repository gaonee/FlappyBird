var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Utils = (function () {
    function Utils() {
    }
    /**
     * 功能：碰撞检测
     */
    Utils.getBounds = function (shp) {
        var width = shp.width * shp.scaleX;
        var height = shp.height * shp.scaleY;
        var bounds = {
            topLeft: {
                x: shp.x,
                y: shp.y
            },
            topRight: {
                x: shp.x + width,
                y: shp.y
            },
            bottomLeft: {
                x: shp.x,
                y: shp.y + height
            },
            bottomRight: {
                x: shp.x + width,
                y: shp.y + height
            }
        };
        if (shp.rotation != 0) {
            var radius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
            var center = {
                x: shp.x + shp.width / 2,
                y: shp.y + shp.height / 2
            };
            bounds = {
                topLeft: {
                    x: center.x + radius * Math.cos(135 + shp.rotation),
                    y: center.y + radius * Math.sin(135 + shp.rotation)
                },
                topRight: {
                    x: center.x + radius * Math.cos(45 + shp.rotation),
                    y: center.y + radius * Math.sin(45 + shp.rotation)
                },
                bottomLeft: {
                    x: center.x + radius * Math.cos(225 + shp.rotation),
                    y: center.y + radius * Math.sin(225 + shp.rotation)
                },
                bottomRight: {
                    x: center.x + radius * Math.cos(315 + shp.rotation),
                    y: center.y + radius * Math.sin(315 + shp.rotation)
                }
            };
        }
        return bounds;
    };
    return Utils;
}());
__reflect(Utils.prototype, "Utils");
//# sourceMappingURL=Utils.js.map