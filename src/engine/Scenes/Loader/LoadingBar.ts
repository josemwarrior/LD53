import { Container } from "pixi.js";
import { Line } from "../../Graphics/Line";

class LoadingBar extends Container
{
    private barBg: Line;
    private barFt: Line;
    private x1: number;
    private x2: number;
    private y1: number;
    private length: number;

    constructor(screenWidth: number, screenHeight: number)
    {
        super();
        this.x1 = (screenWidth / 2) * .6;
        this.x2 = (screenWidth / 2) + (screenWidth / 2) * .4;
        this.y1 = screenHeight / 2 - 2.5;
        this.length = this.x2 - this.x1;
        this.barBg = new Line([this.x1, this.y1, this.x2, this.y1], 5, 0x808080);
        this.barFt = new Line([this.x1, this.y1, this.x1, this.y1], 5, 0xFFFFFF);
        this.addChild(this.barBg);
        this.addChild(this.barFt);
    }

    update(progress: number)
    {
        var newX2: number = this.x + (this.length * (progress / 100));
        this.barFt.updatePoints([this.x, this.y, newX2, this.y]);
    }

}

export { LoadingBar };