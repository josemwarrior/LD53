import { Container, Loader, SCALE_MODES, settings } from "pixi.js";
import { LoadingBar } from "./LoadingBar";
import { assets } from "../../../assets";
import { ManagerScene } from "../ManagerScene";
import { IScene } from "../IScene";
import { GameplayScene } from "../../../game/Scenes/GameplayScene";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";
export class LoaderScene extends Container implements IScene
{
    private loadingbar: LoadingBar;
    constructor(screenWidth: number, screenHeight: number)
    {
        super();
        settings.SCALE_MODE = SCALE_MODES.NEAREST;
        this.loadingbar = new LoadingBar(screenWidth, screenHeight);
        this.addChild(this.loadingbar);
        Loader.registerPlugin(WebfontLoaderPlugin);
        //Loader.shared.baseUrl = <string>process.env.BASE_URL;
        Loader.shared.add(assets);
        Loader.shared.onProgress.add(this.downloadProgress, this);
        Loader.shared.onComplete.once(this.gameLoaded, this);
        Loader.shared.load();
    }
    resize(screenWidth: number, screenHeight: number): void
    {
    }
    private downloadProgress(loader: Loader): void
    {
        this.loadingbar.update(loader.progress);
    }
    private gameLoaded(): void
    {
        this.removeChild(this.loadingbar);
        ManagerScene.switchScene(new GameplayScene());
    }
    public update(deltaTime: number): void
    {
    }
}
