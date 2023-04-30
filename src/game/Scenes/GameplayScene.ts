import { Container, Graphics, InteractionEvent, Loader, ParticleContainer, Point, Sprite, Text, Ticker } from "pixi.js";
import { Easing, Group, Tween } from "tweedle.js";
import { Viewport } from "pixi-viewport";
import { IScene } from "../../engine/Scenes/IScene";
import { Sound } from "@pixi/sound";
export class GameplayScene extends Container implements IScene
{
    SCREEN_HEIGHT: number = 256;
    viewport: Viewport;
    layer: Container = new Container();
    layerHUD: Container = new Container();
    player: Sprite;
    package: Sprite;
    shadowpackage: Sprite;
    target: Sprite;
    text: Text;
    shadowtext: Text;
    offSetYShadow: number = 0;
    canLaunch: boolean = true;

    constructor()
    {
        super();
        Sound.from(Loader.shared.resources['music']).play({ loop: true });
        
        // soil background
        const layerParticles = new ParticleContainer(20000);
        this.layer.addChild(layerParticles);
        for (let tile_y = 0; tile_y < 94; tile_y++) {
            for (let tile_x = 0; tile_x < 200; tile_x++) {
                const tile_sprite = new Sprite(Loader.shared.resources["soil"].texture);
                tile_sprite.x = -1600 + tile_x * 16;
                tile_sprite.y = -1327 + tile_y * 16;
                layerParticles.addChild(tile_sprite);
            }
        }
        // grass background
        const color = 0x79bd9a;
        const width = 44;
        const height = 1500;
        const startX = -1600;
        const startY = -1327;
        const spacingX = 88;
        const numRectangles = 26;
        for (let i = 0; i < numRectangles; i++) 
        {
            const rectangle = new Graphics();
            rectangle.beginFill(color);
            rectangle.drawRect(0, 0, width, height);
            rectangle.endFill();
            rectangle.x = startX + i * spacingX;
            rectangle.y = startY;
            this.layer.addChild(rectangle);
        }

        // spawn target
        this.target = new Sprite(Loader.shared.resources["target"].texture);
        this.layer.addChild(this.target);
        const position: Point = this.getRandomPositionTarget();
        this.target.position.set(position.x, position.y);
        this.target.anchor.set(0.5, 0.5);

        // spawn shadow package
        this.shadowpackage = new Sprite(Loader.shared.resources["shadow"].texture);
        this.layer.addChild(this.shadowpackage);
        this.shadowpackage.anchor.set(0.5, 0.5);
        this.shadowpackage.visible = false;

        // spawn player
        this.player = new Sprite(Loader.shared.resources["player"].texture);
        this.layer.addChild(this.player);
        this.package = new Sprite(Loader.shared.resources["package"].texture);
        this.layer.addChild(this.package);
        this.package.position.set(5, -10);
        this.package.anchor.set(0.5, 0.5);
        this.package.visible = false;
        
        this.shadowpackage.position.set(this.package.x, this.package.y);

        // viewport
        this.viewport = new Viewport({
           ticker: Ticker.shared
        })
        this.viewport.snapZoom({ height: this.SCREEN_HEIGHT, forceStart: true, time: 1 })
        this.viewport.addChild(this.layer);
        this.viewport.follow(this.package)
        this.addChild(this.viewport)

        // HUD
        const rectangleHUD = new Graphics();
        rectangleHUD.lineStyle(1, 0x161957);
        rectangleHUD.drawRect(5+1, this.SCREEN_HEIGHT-55+1, 80, 30);
        this.layerHUD.addChild(rectangleHUD);
        rectangleHUD.lineStyle(1, 0xffffff);
        rectangleHUD.drawRect(5, this.SCREEN_HEIGHT-55, 80, 30);
        this.layerHUD.addChild(rectangleHUD);

        this.shadowtext = new Text('Deliver the package to the target!', 
        { fontFamily: 'm6x11', fill: 0x161957, fontSize: 48 });
        this.shadowtext.scale.set(0.2, 0.2);
        this.shadowtext.roundPixels = true;
        this.layerHUD.addChild(this.shadowtext);
        this.shadowtext.anchor.set(0, 1);
        this.shadowtext.position.set(10+1, this.SCREEN_HEIGHT -30+1);

        this.text = new Text('Deliver the package to the target!', 
        { fontFamily: 'm6x11', fill: 0xffffff, fontSize: 48 });
        this.text.scale.set(0.2, 0.2);
        this.text.roundPixels = true;
        this.layerHUD.addChild(this.text);
        this.text.anchor.set(0, 1);
        this.text.position.set(10, this.SCREEN_HEIGHT -30);
        
        // distance to target
        this.printDistanceToTarget();


        // interaction
        let startPoint: Point;
        let endPoint: Point;

        this.interactive = true;
        this.on('pointerdown', (event: InteractionEvent) => {
            if (!this.canLaunch) return;
            startPoint = event.data.getLocalPosition(this.parent);
        });

        this.on('pointerup', (event: InteractionEvent) => {
            if (!this.canLaunch) return;
            this.canLaunch = false;
            endPoint = event.data.getLocalPosition(this.parent);
            Sound.from(Loader.shared.resources['launch']).play();
            const dx = endPoint.x - startPoint.x;
            const dy = endPoint.y - startPoint.y
            const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
            const direction = Math.atan2(dy, dx);
            console.log(`distance: ${distance}, direction: ${direction}`);
            const finalX = this.package.position.x + Math.cos(direction) * distance;
            const finalY = this.package.position.y + Math.sin(direction) * distance;
            // change sprites
            this.player.texture = Loader.shared.resources["player_launched"].texture!;
            this.package.visible = true;
            this.shadowpackage.visible = true;
            const duration = 3000;
            new Tween(this.package.position).to( { x: finalX, y: finalY }, duration).easing(Easing.Linear.None).start().onComplete(() => {
                Sound.from(Loader.shared.resources['ground']).play();
            });
            new Tween(this).to( {offSetYShadow: distance/3}, duration * .3).easing(Easing.Linear.None).start().yoyo(true).repeat(1).onComplete(() => {
                Sound.from(Loader.shared.resources['ground']).play();
                new Tween(this).to( {offSetYShadow: distance/9}, duration * 0.15).easing(Easing.Linear.None).start().yoyo(true).repeat(1).onComplete(() => {
                    Sound.from(Loader.shared.resources['ground']).play();
                    new Tween(this).to( {offSetYShadow: distance/30}, duration * .05).easing(Easing.Linear.None).start().yoyo(true).repeat(1).onComplete(() => {
                        Sound.from(Loader.shared.resources['ground']).play();
                        console.log(this.package.position.y)
                        // draw line to target
                        const line = new Graphics();
                        line.lineStyle(1, 0x161957);
                        line.moveTo(this.package.x+1, this.package.y+1);
                        line.lineTo(this.target.x+1, this.target.y+1);
                        line.lineStyle(1, 0xffffff);
                        line.moveTo(this.package.x, this.package.y);
                        line.lineTo(this.target.x, this.target.y);
                        // show distance to target
                        const distanceToTarget = Math.round(Math.sqrt(Math.pow(this.package.x - this.target.x, 2) + Math.pow(this.package.y - this.target.y, 2)));
                        const textDistanceShadow = new Text(`${distanceToTarget}m`,
                        { fontFamily: 'm6x11', fill: 0x161957, fontSize: 48 });
                        textDistanceShadow.scale.set(0.2, 0.2);
                        textDistanceShadow.roundPixels = true;
                        textDistanceShadow.anchor.set(0.5, 0.5);
                        textDistanceShadow.position.set(this.package.x + 10 + 1, this.package.y + 10 + 1);
                        const textDistance = new Text(`${distanceToTarget}m`,
                        { fontFamily: 'm6x11', fill: 0xffffff, fontSize: 48 });
                        textDistance.scale.set(0.2, 0.2);
                        textDistance.roundPixels = true;
                        textDistance.anchor.set(0.5, 0.5);
                        textDistance.position.set(this.package.x + 10, this.package.y + 10);
                        
                        // Delivered package text
                        const textDeliveredS = new Text('You delivered the package!',
                        { fontFamily: 'm6x11', fill: 0x161957, fontSize: 48, align: 'center' });
                        textDeliveredS.scale.set(0.2, 0.2);
                        textDeliveredS.roundPixels = true;
                        textDeliveredS.anchor.set(0.5, 0.5);
                        textDeliveredS.position.set(this.package.x + 1, this.package.y + 20 + 1);
                        const textDelivered = new Text('You delivered the package!',
                        { fontFamily: 'm6x11', fill: 0xffffff, fontSize: 48, align: 'center' });
                        textDelivered.scale.set(0.2, 0.2);
                        textDelivered.roundPixels = true;
                        textDelivered.anchor.set(0.5, 0.5);
                        textDelivered.position.set(this.package.x, this.package.y + 20);

                        // show lines
                        setTimeout(() => {
                            this.layer.addChild(line);
                            this.layer.addChild(line);
                            this.layer.addChild(textDistanceShadow);
                            this.layer.addChild(textDistance);
                            if (distanceToTarget < 30) 
                            {
                                this.layer.addChild(textDeliveredS);
                                this.layer.addChild(textDelivered);
                                Sound.from(Loader.shared.resources['applause']).play();
                            } 
                            else 
                            {
                                Sound.from(Loader.shared.resources['distance']).play();
                            }

                        }, 1000);
                        //reset level
                        setTimeout(() => {
                            this.player.texture = Loader.shared.resources["player"].texture!;
                            this.package.visible = false;
                            this.shadowpackage.visible = false;
                            this.package.position.set(5, -10);
                            this.offSetYShadow = 0;
                            this.viewport.snapZoom({ height: this.SCREEN_HEIGHT, forceStart: true, time: 1 })
                            this.viewport.follow(this.package)
                            // respawn target
                            this.target.position.set(this.getRandomPositionTarget().x, this.getRandomPositionTarget().y);
                            this.printDistanceToTarget();
                            this.canLaunch = true;
                            // remove line
                            this.layer.removeChild(line);
                            // remove distance to target
                            this.layer.removeChild(textDistance);
                            this.layer.removeChild(textDistanceShadow);
                            this.layer.removeChild(textDeliveredS);
                            this.layer.removeChild(textDelivered);
                            
                        }, 3000);
                    });
                });
            });

        });

        this.addChild(this.layerHUD);
        this.resize(window.innerWidth, window.innerHeight);
    }

    printDistanceToTarget() 
    {
        const dx = this.target.x - this.package.x;
        const dy = this.target.y - this.package.y;
        const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
        const angleInRadians  = Math.atan2(dy, dx);
        const angleInDegrees = Math.round(angleInRadians * (180 / Math.PI)) * -1;
        console.log(`distance: ${distance}, angleInRadians:  ${angleInRadians} ,angle: ${angleInDegrees}`);
        this.text.text = `Distance: ${distance}\nAngle: ${angleInDegrees} degrees`;
        this.shadowtext.text = `Distance: ${distance}\nAngle: ${angleInDegrees} degrees`;
    }

    getRandomPositionTarget(): Point 
    {
        const minX = -500;
        const maxX = 500;
        const minY = -500;
        const maxY = -50;
        const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        return new Point(x, y);
    }

    update(framesPassed: number): void 
    {
        Group.shared.update();
        this.shadowpackage.position.set(this.package.x, this.package.y + this.offSetYShadow);
    }

    resize(screenWidth: number, screenHeight: number): void 
    {
        this.viewport.resize()
        var scale: number = screenHeight / this.SCREEN_HEIGHT;
        this.layerHUD.scale.set(scale);
    }

}