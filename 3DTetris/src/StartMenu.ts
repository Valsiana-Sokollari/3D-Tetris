import {Scene} from "@babylonjs/core"
import { AdvancedDynamicTexture, Rectangle,Image, Control, Button } from '@babylonjs/gui/2D';

export class StartMenu{
    private guiMenu:AdvancedDynamicTexture;
    private playButton:Button;
    private title:Image;

    constructor(scene:Scene){
    this.guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui",true,scene);
    const backgroundMenu = new Rectangle("background");
    backgroundMenu.width ="100";
    backgroundMenu.height="100%";
    backgroundMenu.background = "#000000";
    this.guiMenu.addControl(backgroundMenu);

    this.title = new Image("logoTitle","../../dist/assets/tetrisLogo.svg");
    this.styleTitle();
    this.guiMenu.addControl(this.title);

    this.playButton = Button.CreateSimpleButton("PlayBtn","Play");
    this.styleButton("Play");
    this.guiMenu.addControl(this.playButton);

    this.onResize();
     window.addEventListener("resize", () => {
            this.onResize();
        });
}
    

    private styleTitle(){
        this.title.stretch =Image.STRETCH_UNIFORM;
        this.title.width =0.7;
        this.title.height=0.45;
        this.title.verticalAlignment=Control.VERTICAL_ALIGNMENT_TOP;
        this.title.horizontalAlignment=Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.title.top=(window.innerHeight/8);
    }

    private styleButton(text:string){

        this.playButton.color="white";
        this.playButton.fontFamily="Agency FB";
        this.playButton.fontSizeInPixels=window.innerWidth*0.06;
        this.playButton.fontWeight ="600";
        this.playButton.height = 0.2;
        this.playButton.width =0.3;
        this.playButton.top =-(window.innerHeight/7);
        this.playButton.thickness=0;
        this.playButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.playButton.onPointerEnterObservable.add(()=>{
            if (this.playButton.textBlock) {
               this.playButton.textBlock.text = `▶ ${text }`;
            }
            this.playButton.color = "#03C04A";

        });
    
        this.playButton.onPointerOutObservable.add(()=>{
            if (this.playButton.textBlock) {
                this.playButton.textBlock.text = text;
            } 
            this.playButton.color="white";
        });
    }
    private onResize() {

        if (this.playButton) { 
            this.playButton.fontSizeInPixels = window.innerWidth*0.06;
            this.playButton.height = 0.2;
            this.playButton.width = 0.3;
            this.playButton.top = -(window.innerHeight / 7);
        }
    }
    public getPlayButton(){
        return this.playButton;
    }
    public hide(){
        this.guiMenu.dispose();
    }

}