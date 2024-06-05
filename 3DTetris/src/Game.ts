import {Color4, Scene} from "@babylonjs/core";
import { AdvancedDynamicTexture, Control,TextBlock } from "@babylonjs/gui";
import { GameBoard } from "./GameBoard";
import {Tetromino} from "./Tetromino"

export class Game{
    private gameBoard:GameBoard;
    private gameUI:AdvancedDynamicTexture;
    private pointDisplayer:TextBlock;
    private scene:Scene;
    private points:number;
    private fallingInterval:number;
    public  activeBlock:Tetromino|null=null;

    constructor(scene:Scene){
      this.scene=scene;
      this.scene.clearColor = new Color4(0,0,0,1); 
      this.points =0;
      this.fallingInterval=1000;
      this.gameBoard = new GameBoard(this.scene);
      this.gameUI = AdvancedDynamicTexture.CreateFullscreenUI("ui",true,this.scene);
      this.pointDisplayer= new TextBlock("pointDisplayer")
      this.createGameUI();
      this.activeBlock=Tetromino.chooseATetromino(this.scene);

      window.addEventListener("keydown", this.handleKeydown.bind(this));
      
    }

    private createGameUI(){
        this.pointDisplayer.text =`Points: ${this.points}`;
        this.pointDisplayer.color="white";
        this.pointDisplayer.fontWeight="600";
        this.pointDisplayer.width = 0.1*window.innerWidth;
        this.pointDisplayer.fontSize = 0.03*window.innerWidth;
        this.pointDisplayer.fontFamily ="Agency FB";
        this.pointDisplayer.textHorizontalAlignment =Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.pointDisplayer.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.pointDisplayer.paddingLeft = window.innerWidth*0.7;
        this.pointDisplayer.top =window.innerWidth*0.05;
        this.gameUI.addControl(this.pointDisplayer);
      }

    private handleKeydown(event: KeyboardEvent) {
      if (this.activeBlock) {
          switch (event.key) {
              case "ArrowLeft":
                if(this.gameBoard.canMoveLeft(this.activeBlock)){
                  this.activeBlock.move("x",-1)
                }
                  break;
              case "ArrowRight":
                if(this.gameBoard.canMoveRight(this.activeBlock)){
                  this.activeBlock.move("x",1);
                  
               }
                  break;
              case "ArrowUp":
                if(this.gameBoard.canMoveIn(this.activeBlock)){
                  this.activeBlock.move("z",1);
                 
               }
                  break;
              case "ArrowDown":
                if(this.gameBoard.canMoveOut(this.activeBlock)){
                  this.activeBlock.move("z",-1);
                 
               }
                  break;
                case "d":
                   if(this.gameBoard.canRotateX(this.activeBlock)){
                    this.activeBlock.rotateX();
                 }
                   break;

                   case "w":
                   if(this.gameBoard.canRotateY(this.activeBlock)){
                    this.activeBlock.rotateY();
                 }
                  break;

                  case "s":
                   if(this.gameBoard.canRotateZ(this.activeBlock)){
                    this.activeBlock.rotateZ();
                 }
                  break;

                  case " ":
                    if(this.gameBoard.canMoveDown(this.activeBlock)){
                     this.activeBlock.move("y",-1);
                  }
                   break;
                  
          }
      }
  }

    public updatePoints(pointsWonInRound:number){
      this.points+=pointsWonInRound*81;
      this.pointDisplayer.text =`Points: ${this.points}`;
      
    }

    public reselectActiveTetromino(){
      this.activeBlock=Tetromino.chooseATetromino(this.scene);
    }

    public getFallingInterval(){
      return this.fallingInterval;
    }

    public getBoard(){
      return this.gameBoard;
    }
     
  

}