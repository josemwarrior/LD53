import { Graphics } from "pixi.js";

class Line extends Graphics
{
    lineWidth: number;
    lineColor: number;
    points: number[];

    constructor(points: number[], lineSize: number, lineColor: number)
    {
        super();

        var s: number = this.lineWidth = lineSize || 5;
        var c: number = this.lineColor = lineColor || 0x000000;

        this.points = points;

        this.lineStyle(s, c)

        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }

    updatePoints(p: number[])
    {

        var points: number[] = this.points = p.map((val, index) => val || this.points[index]);

        var s = this.lineWidth, c = this.lineColor;

        this.clear();
        this.lineStyle(s, c);
        this.moveTo(points[0], points[1]);
        this.lineTo(points[2], points[3]);
    }

}

export { Line };