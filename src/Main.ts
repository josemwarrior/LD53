import { Resize, SCREEN_HEIGHT, SCREEN_WIDTH } from "./game/Cons";
import { utils } from "pixi.js"
import { ManagerScene } from "./engine/Scenes/ManagerScene";
import { LoaderScene } from "./engine/Scenes/Loader/LoaderScene";

export const BACKGROUND_COLOR: number = 0xcff09e;

// Remove banner from console.
utils.skipHello();

ManagerScene.initialize(SCREEN_WIDTH, SCREEN_HEIGHT, BACKGROUND_COLOR, Resize.LETTERBOX);
ManagerScene.switchScene(new LoaderScene(SCREEN_WIDTH, SCREEN_HEIGHT));
