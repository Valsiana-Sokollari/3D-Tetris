import { Color3, GroundMesh, Mesh, MeshBuilder,Scene, Vector3 } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";
import { Tetromino } from "./Tetromino";


export class GameBoard{
    private readonly size:number=11;
    private ground:GroundMesh;
    private leftPlane:Mesh;
    private rightPlane:Mesh;
    private frontPlane:Mesh;
    private backPlane:Mesh;
    public landedBlocks: { [key: number]:Mesh[] }
    public occuppied:number[][][];

    constructor(scene:Scene){
        this.ground = MeshBuilder.CreateGround("ground", {width:this.size-2, height:this.size-2}, scene);
        this.ground.position.x=5;
        this.ground.position.y=0.5;
        this.ground.position.z=5;

        this.backPlane =MeshBuilder.CreatePlane("backPlane",{width:this.size-2,height:this.size-2},scene);
        this.backPlane.position.z = 9.5;
        this.backPlane.position.y=5;
        this.backPlane.position.x=5;

        this.frontPlane =MeshBuilder.CreatePlane("frontPlane",{width:this.size-2,height:this.size-2},scene);
        this.frontPlane.position.z =0.5;
        this.frontPlane.position.x=5;
        this.frontPlane.position.y=5;

        this.rightPlane =MeshBuilder.CreatePlane("rightPlane",{width:this.size-2,height:this.size-2},scene);
        this.rightPlane.rotation.y =Math.PI/2;
        this.rightPlane.position.z=5;
        this.rightPlane.position.y=5;
        this.rightPlane.position.x=9.5;

        this.leftPlane =MeshBuilder.CreatePlane("leftPlane",{width:this.size-2,height:this.size-2},scene);
        this.leftPlane.rotation.y = -Math.PI/2;
        this.leftPlane.position.z=5;
        this.leftPlane.position.y=5;
        this.leftPlane.position.x=0.5;

        this.landedBlocks={};

        this.setMaterials(scene);
        this.enableCollisions();
        this.occuppied=[];
        this.initializeMatrix();
    }


     private createGrid(scene:Scene):GridMaterial{
        let grid = new GridMaterial("grid", scene);
        grid.lineColor = Color3.White();
        grid.majorUnitFrequency = 1; 
        grid.opacity = 0.9;
        grid.gridOffset = new Vector3(0.5, 0.5, 0.5);
        return grid;
      }  


      private setMaterials(scene:Scene){
        let planeGrid = this.createGrid(scene);
        this.frontPlane.material=planeGrid;
        this.backPlane.material=planeGrid;
        this.ground.material=planeGrid;
        this.leftPlane.material=planeGrid;
        this.rightPlane.material=planeGrid;
      }

      private enableCollisions(){
        this.frontPlane.checkCollisions=true;
        this.backPlane.checkCollisions=true;
        this.ground.checkCollisions=true;
        this.leftPlane.checkCollisions=true;
        this.rightPlane.checkCollisions=true;
      }

      private initializeMatrix(){
         for (let x=0;x<this.size;x++){
          this.occuppied[x] =[];
          for(let y=0;y<=this.size;y++){
            this.occuppied[x][y] = [];
            for(let z=0;z<this.size;z++){
                 if(y===0||x===0||x===10||z===10||z===0){
                     this.occuppied[x][y][z]=1;
                 }
                 else {
                  this.occuppied[x][y][z]=0;
                 }
            }
          }
         }
         console.log("Occuoied right after initialization: "+this.occuppied);
      }

      public canMoveLeft(tetromino:Tetromino):boolean{
        const XPositions:number[]= tetromino.getXPositionsOfBlocks();
        const YPositions:number[]=tetromino.getYPositionsOfBlocks();
        const ZPositions:number[]=tetromino.getZPositionsOfBlocks();
        for(let i=0;i<XPositions.length;i++){
         if(this.occuppied[XPositions[i]-1][YPositions[i]][ZPositions[i]]){
           return false;
         }
       }
         return true;
      }

      public canMoveRight(tetromino:Tetromino):boolean{
       const XPositions:number[]= tetromino.getXPositionsOfBlocks();
       const YPositions:number[]=tetromino.getYPositionsOfBlocks();
       const ZPositions:number[]=tetromino.getZPositionsOfBlocks();
       for(let i=0;i<XPositions.length;i++){
        if(this.occuppied[XPositions[i]+1][YPositions[i]][ZPositions[i]]){
          return false;
        }
      }
        return true;
      }

      public canMoveDown(tetromino:Tetromino):boolean{
       const XPositions:number[]= tetromino.getXPositionsOfBlocks();
       const YPositions:number[]=tetromino.getYPositionsOfBlocks();
       const ZPositions:number[]=tetromino.getZPositionsOfBlocks();
      for(let i=0;i<XPositions.length;i++){
        if(this.occuppied[XPositions[i]][YPositions[i]-1][ZPositions[i]]){
          return false;
        }
      }
        return true;
      }

      public canMoveIn(tetromino:Tetromino){
        const XPositions:number[]= tetromino.getXPositionsOfBlocks();
        const YPositions:number[]=tetromino.getYPositionsOfBlocks();
        const ZPositions:number[]=tetromino.getZPositionsOfBlocks();
        for(let i=0;i<ZPositions.length;i++){
         if(this.occuppied[XPositions[i]][YPositions[i]][ZPositions[i]+1]){
           return false;
         }
       }
         return true;

      }

      public canMoveOut(tetromino:Tetromino){
        const XPositions:number[]= tetromino.getXPositionsOfBlocks();
        const YPositions:number[]=tetromino.getYPositionsOfBlocks();
        const ZPositions:number[]=tetromino.getZPositionsOfBlocks();
        for(let i=0;i<ZPositions.length;i++){
         if(this.occuppied[XPositions[i]][YPositions[i]][ZPositions[i]-1]){
           return false;
         }
       }
         return true;

      }


      public canRotateX(tetromino:Tetromino):boolean{
        let finalPositions = tetromino.tryToRotateX();
        for(let i=0;i<finalPositions.length;i++){
          if(this.occuppied[finalPositions[i].x][finalPositions[i].y][finalPositions[i].z])
            return false;
        }
        return true;
      }

      public canRotateY(tetromino:Tetromino):boolean{
        let finalPositions = tetromino.tryToRotateY();
        for(let i=0;i<finalPositions.length;i++){
          if(this.occuppied[finalPositions[i].x][finalPositions[i].y][finalPositions[i].z])
            return  false;
        }
        return true;
          
      }

      public canRotateZ(tetromino:Tetromino):boolean{
        if(tetromino.getShape()==="O"){
          return false;
        }
        let finalPositions = tetromino.tryToRotateZ();
        for(let i=0;i<finalPositions.length;i++){
          if(this.occuppied[finalPositions[i].x][finalPositions[i].y][finalPositions[i].z])
            return  false;
        }
        return true;
          
      }

      public isGameOver():boolean{
       for (let x = 1; x < (this.size-1); x++) {
          for (let z = 1; z < (this.size-1); z++) {
              if (this.occuppied[x][10][z] === 1) {
                return true; 
            }
      }

    }

    return false;
  }

      public occupyPosition(tetromino:Tetromino):void{
        let XPositions =tetromino.getXPositionsOfBlocks();
        let YPositions=tetromino.getYPositionsOfBlocks();
        let ZPositions=tetromino.getZPositionsOfBlocks();
       for(let i=0;i<XPositions.length;i++){
         this.occuppied[XPositions[i]][YPositions[i]][ZPositions[i]]=1;
       }
     }

     public fillLandedBlocks(tetromino:Tetromino):void{
        let  unitBlocks = tetromino.getComposingBlocks();
        unitBlocks.forEach(block => {
          let yPosition = block.position.y; 
            if (!this.landedBlocks[yPosition]) {
                this.landedBlocks[yPosition] = [];
            }
            this.landedBlocks[yPosition].push(block);
      });
     }

     public checkedFilledLayers():number{
      let filledLayers:number[]=[];
       for(let y=1;y<(this.size-1);y++){  
        let count:number=0;
          for(let x=1;x<(this.size-1);x++){
            for(let z=1;z<(this.size-1);z++){
              if(this.occuppied[x][y][z]===1){
                     count+=1;
                     console.log("Position ["+ x+"]["+y+"]["+z+"] is occupied");
              }
            }
          }
          if(count===81){
            filledLayers.push(y);
          }
          console.log("Number of blocks for layer "+y+" "+count+" blocks");
       }
       console.log("Number of totally filled layers: "+filledLayers.length);
       this.clearFilledLayers(filledLayers);
       return filledLayers.length;
     }

     private clearFilledLayers(filledLayers:number[]):void{
         filledLayers.forEach(filledLayer=>{
          let blocksAtFilledLayer: Mesh[]= this.landedBlocks[filledLayer];
          if (blocksAtFilledLayer) {
            blocksAtFilledLayer.forEach(block => {
                block.dispose();
            });
         } 
         this.updateLayer(filledLayer);
     });
     }

     private updateLayer(filledLayer:number):void{
      for (let y = filledLayer; y < (this.size-1); y++) {
        for (let x = 1; x < (this.size-1); x++) {
            for (let z = 1; z < (this.size-1); z++) {
                this.occuppied[x][y][z] = this.occuppied[x][y+1][z];
            }
        }
    }

       for(let y=filledLayer;y<(this.size-1);y++){
        if (this.landedBlocks[y + 1]) {
          this.landedBlocks[y] = [...this.landedBlocks[y + 1]];
          let blocksToBeMoved:Mesh[] = this.landedBlocks[y];
          blocksToBeMoved.forEach(block=>{
            block.position.y-=1;
          });
      } else {
          this.landedBlocks[y] = [];
      }
       }
       
     }



}