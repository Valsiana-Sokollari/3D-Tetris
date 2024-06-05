import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

interface BlockStructure {
    blocksPositions: Vector3[];
    center: Vector3;
    color:Color3
}

 export class Tetromino{
    public static types:string[] =['I','J','L','O','S','T','Z'];
    private shape:string;
    private centerOfRotation:Mesh|null =null;
    private composingBlocks:Mesh[];

    private static  tetrominoStructure:BlockStructure[]=[
         
        { blocksPositions:[ 
            new Vector3(3,11,5),
            new Vector3(4,11,5),
            new Vector3(5,11,5),
            new Vector3(6,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(0.67, 0.77, 1.00)
        },

        { blocksPositions:[ 
            new Vector3(4,12,5),
            new Vector3(4,11,5),
            new Vector3(5,11,5),
            new Vector3(6,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(0.72, 0.88, 0.82)
        },

        { blocksPositions:[ 
            new Vector3(6,12,5),
            new Vector3(6,11,5),
            new Vector3(5,11,5),
            new Vector3(4,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(1.00, 0.93, 0.58)
        },

        { blocksPositions:[ 
            new Vector3(5,12,5),
            new Vector3(6,12,5),
            new Vector3(5,11,5),
            new Vector3(6,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(0.92, 0.77, 0.84)
        },

        { blocksPositions:[ 
            new Vector3(4,11,5),
            new Vector3(5,11,5),
            new Vector3(5,12,5),
            new Vector3(6,12,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(0.82, 0.81, 0.89)
        },

        { blocksPositions:[ 
            new Vector3(5,12,5),
            new Vector3(5,11,5),
            new Vector3(4,11,5),
            new Vector3(6,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(1.00, 0.65, 0.62)
        },

        { blocksPositions:[ 
            new Vector3(4,12,5),
            new Vector3(5,12,5),
            new Vector3(5,11,5),
            new Vector3(6,11,5)
        ],

        center: new Vector3(5,11,5),
        color: new Color3(0.41, 0.71, 0.94)
        },
    ];

    constructor(type:string,scene:Scene){
        this.shape=type;
        this.composingBlocks=[];
        let index =Tetromino.types.indexOf(type);
        let positions=Tetromino.tetrominoStructure[index].blocksPositions;
        let centerOfTetromino = Tetromino.tetrominoStructure[index].center;
        positions.forEach((blockPosition)=>{
            const box:Mesh = MeshBuilder.CreateBox("unitBox",{size:1},scene);
            if(blockPosition.equals(centerOfTetromino)){
                this.centerOfRotation=box;
            }
            this.setColor(box,scene);
            box.position=blockPosition.clone();
            this.composingBlocks.push(box);
        });
    }

    private setColor(box:Mesh,scene:Scene){
        let index = Tetromino.types.indexOf(this.shape);
        let color = Tetromino.tetrominoStructure[index].color;
        let colorMaterial = new StandardMaterial("colorMaterial", scene);
        box.enableEdgesRendering();
        box.edgesWidth = 3.0;
        box.edgesColor = new Color4(color.r*1.8, color.g*1.8,color.b*1.8, 1);
        colorMaterial.diffuseColor =color;
        box.material=colorMaterial;
    }

    public static chooseATetromino(scene:Scene):Tetromino{
        let selectedIndex =Math.floor(Math.random()*7);
        let shapeChoosen =Tetromino.types[selectedIndex];
        return new Tetromino(shapeChoosen,scene);
   }

   public freeFall(){
        for(let i=0;i<this.composingBlocks.length;i++){
            this.composingBlocks[i].position.y-=1;

        }
   }

   public move(axis:string,amount:number){
    switch (axis) {
        case "x":
            for(let i=0;i<this.composingBlocks.length;i++){
                this.composingBlocks[i].position.x+=amount;
            }
            break;
            case "y":
            for(let i=0;i<this.composingBlocks.length;i++){
                this.composingBlocks[i].position.y+=amount;
            }
          
            break;
            case "z":
                for(let i=0;i<this.composingBlocks.length;i++){
                    this.composingBlocks[i].position.z+=amount;
                }
              
                break;
    }
 }

    
    public rotateX():void{
        let finalPositions:Vector3[] =this.tryToRotateX();
          for(let i=0;i<this.composingBlocks.length;i++){
             this.composingBlocks[i].position = finalPositions[i];
          }
 
     }

     public rotateY():void{
        let finalPositions:Vector3[] =this.tryToRotateY();
          for(let i=0;i<this.composingBlocks.length;i++){
             this.composingBlocks[i].position = finalPositions[i];
          }
 
     }
 
     public rotateZ():void{
        let finalPositions:Vector3[] =this.tryToRotateZ();
          for(let i=0;i<this.composingBlocks.length;i++){
             this.composingBlocks[i].position = finalPositions[i];
          }
 
     }

    public tryToRotateX():Vector3[]{
        let pointOfRotation = new Vector3(this.centerOfRotation?.position.x,this.centerOfRotation?.position.y,this.centerOfRotation?.position.z);
        let finalPositions:Vector3[]=[];
        for(let i=0;i<this.composingBlocks.length;i++){
           let positionOfCurrentBlock = new Vector3(this.composingBlocks[i].position.x,this.composingBlocks[i].position.y,this.composingBlocks[i].position.z);
           let originalPosOfCurrentBlock:Vector3 = Vector3.Zero();
           positionOfCurrentBlock.subtractToRef(pointOfRotation,originalPosOfCurrentBlock);
           let rotatedPosition = new Vector3(originalPosOfCurrentBlock.x,-originalPosOfCurrentBlock.z,originalPosOfCurrentBlock.y);
           let finalPosition = rotatedPosition.add(pointOfRotation);
           finalPositions.push(finalPosition);
        }
        return finalPositions;
    }

    public tryToRotateY():Vector3[]{
        let pointOfRotation = new Vector3(this.centerOfRotation?.position.x,this.centerOfRotation?.position.y,this.centerOfRotation?.position.z);
        let finalPositions:Vector3[]=[];
        for(let i=0;i<this.composingBlocks.length;i++){
           let positionOfCurrentBlock = new Vector3(this.composingBlocks[i].position.x,this.composingBlocks[i].position.y,this.composingBlocks[i].position.z);
           let originalPosOfCurrentBlock:Vector3 = Vector3.Zero();
           positionOfCurrentBlock.subtractToRef(pointOfRotation,originalPosOfCurrentBlock);
           let rotatedPosition = new Vector3(originalPosOfCurrentBlock.z,originalPosOfCurrentBlock.y,-originalPosOfCurrentBlock.x);
           let finalPosition = rotatedPosition.add(pointOfRotation);
           finalPositions.push(finalPosition);
        }
        return finalPositions;
    }

    public tryToRotateZ():Vector3[]{
        let pointOfRotation = new Vector3(this.centerOfRotation?.position.x,this.centerOfRotation?.position.y,this.centerOfRotation?.position.z);
        let finalPositions:Vector3[]=[];
        for(let i=0;i<this.composingBlocks.length;i++){
           let positionOfCurrentBlock = new Vector3(this.composingBlocks[i].position.x,this.composingBlocks[i].position.y,this.composingBlocks[i].position.z);
           let originalPosOfCurrentBlock:Vector3 = Vector3.Zero();
           positionOfCurrentBlock.subtractToRef(pointOfRotation,originalPosOfCurrentBlock);
           let rotatedPosition = new Vector3(-originalPosOfCurrentBlock.y,originalPosOfCurrentBlock.x,originalPosOfCurrentBlock.z);
           let finalPosition = rotatedPosition.add(pointOfRotation);
           finalPositions.push(finalPosition);
        }
        return finalPositions;
    }



   public getXPositionsOfBlocks():number[]{
    return this.composingBlocks.map(block => block.position.x);
   }

   public getYPositionsOfBlocks():number[]{
    return this.composingBlocks.map(block => block.position.y);
   }
   
   public getZPositionsOfBlocks():number[]{
    return this.composingBlocks.map(block => block.position.z);
   }
   

public getComposingBlocks(){
    return this.composingBlocks;
}

public getShape():string{
    return this.shape;
}

   
}