import * as PIXI from 'pixi.js';
import { Resize } from "../../game/Cons";
export class ManagerScene
{
    private constructor() {  }
    private static app: PIXI.Application;
    private static currentScene: IScene;
    private static responsive: Resize;
    private static _width: number;
    private static _height: number;
    public static get width(): number { return ManagerScene._width; }
    public static get height(): number { return ManagerScene._height; }
    public static initialize(width: number, height: number, background: number, responsive: Resize): void
    {
        ManagerScene._width = width;
        ManagerScene._height = height;
        ManagerScene.responsive = responsive;
        ManagerScene.app = new PIXI.Application({
            view: document.getElementById('game') as HTMLCanvasElement,
            backgroundColor: background,
            antialias: false,
            //resizeTo: document.getElementById('game') as HTMLCanvasElement,
            resizeTo: window,
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        ManagerScene.app.ticker.add(ManagerScene.update);
        window.addEventListener("resize", ManagerScene.resize);
        ManagerScene.resize();
        (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ && (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
        console.log((window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__);
    }
    public static resize(): void
    {
        setTimeout(function ()
        {
            if (ManagerScene.currentScene)
                ManagerScene.currentScene.resize(ManagerScene.app.screen.width, ManagerScene.app.screen.height)
        }, 500);
    }
    public static switchScene(scene: IScene): void
    {
        if (ManagerScene.currentScene)
        {
            ManagerScene.app.stage.removeChild(ManagerScene.currentScene);
            ManagerScene.currentScene.destroy();
        }
        ManagerScene.currentScene = scene;
        ManagerScene.app.stage.addChild(ManagerScene.currentScene);
        ManagerScene.currentScene.resize(ManagerScene.app.screen.width, ManagerScene.app.screen.height);
    }
    private static update(deltaTime: number): void
    {
        if (ManagerScene.currentScene)
        {
            ManagerScene.currentScene.update(ManagerScene.app.ticker.deltaTime);
        }
    }
}
export interface IScene extends PIXI.DisplayObject 
{
    update(framesPassed: number): void;
    resize(screenWidth: number, screenHeight: number): void;
}
