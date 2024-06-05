import {ArcRotateCamera,Engine, HemisphericLight, Scene, Vector3}from "@babylonjs/core";
import { StartMenu } from "./StartMenu";
import { Game } from './Game';
import { gameOverMenu } from "./GameOver";
import { Tetromino } from "./Tetromino";
 class App{
    private startMenu:StartMenu|null=null;
    private gameOverMenu:gameOverMenu|null=null;
    private game:Game|null=null;
    private status:string;
    private canvas:HTMLCanvasElement;
    private scene:Scene;
    private lastFallTime:number=0;
    
    constructor(){
        this.canvas=document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new Engine(this.canvas,true);
        this.scene= new Scene(engine);
        this.status="start";
        this.createScene();
        engine.runRenderLoop(()=>{
            if(this.status==="playing"&&this.game){
             if(this.game?.activeBlock===null){
               this.game.reselectActiveTetromino();
             }
             const now = Date.now();
            if ( now - this.lastFallTime > this.game?.getFallingInterval()) {
                if(this.game.activeBlock!=null&&this.game.getBoard()?.canMoveDown(this.game.activeBlock)){
                    this.game?.activeBlock.freeFall();
                    this.lastFallTime = now;
                }
                else{
                    let activeTetromino =this.game.activeBlock as Tetromino;
                    this.game.getBoard().occupyPosition(activeTetromino);
                    this.game.getBoard().fillLandedBlocks(activeTetromino);
                    let pointsWon=this.game.getBoard().checkedFilledLayers();
                    this.game.updatePoints(pointsWon);
                    this.game.activeBlock=null;
                }
            }

            if(this.game.getBoard().isGameOver()){
                this.status="gameOver";
                this.game=null;
                this.scene.dispose();
                this.scene = new Scene(engine);
                this.createScene();
            }
        }


             this.scene.render();
        });

        window.addEventListener("resize",()=>{
            engine.resize();
        })
    }

     private createScene(){
        const camera:ArcRotateCamera = new ArcRotateCamera("mainCamera",-Math.PI / 2, Math.PI / 4, 20, new Vector3(5, 5, 5),this.scene);
        camera.attachControl(this.canvas, true);
        camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
        const light:HemisphericLight = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene)
        light.intensity=0.7;
        
        if(this.status==="start"){
            this.startMenu = new StartMenu(this.scene);
            this.startMenu.getPlayButton().onPointerClickObservable.add(()=>{
                   this.status="playing";
                   this.startMenu?.hide();
                   this.game = new Game(this.scene);
            });
           }
        else if(this.status==="playing"){
            this.game = new Game(this.scene);
        }
        else {
            this.gameOverMenu = new gameOverMenu(this.scene);
            this.gameOverMenu.getRestartButton().onPointerClickObservable.add(()=>{
                this.status="playing";
                this.gameOverMenu?.hide();
                this.game = new Game(this.scene);
         });

         this.gameOverMenu.getMenuButton().onPointerClickObservable.add(()=>{
            this.status="start";
            this.gameOverMenu?.hide();
            this.startMenu = new StartMenu(this.scene);
            this.startMenu.getPlayButton().onPointerClickObservable.add(()=>{
                this.status="playing";
                this.startMenu?.hide();
                this.game = new Game(this.scene);
         });
     });
        }
        }
    

}


new App();