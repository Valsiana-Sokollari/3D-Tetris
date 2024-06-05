import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, TextBlock } from "@babylonjs/gui";

export class gameOverMenu{

    private guiMenu:AdvancedDynamicTexture;
    private restartButton:Button;
    private goToMenuButton:Button
    private message:TextBlock;

    constructor(scene:Scene){
        this.guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("GameOverUI",true,scene);
        this.guiMenu.background = "black";
        this.message = new TextBlock("gameOverMessage");
        this.styleMessage();
        this.guiMenu.addControl(this.message);

        this.restartButton = Button.CreateSimpleButton("RestartButton","Restart");
        this.restartButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.restartButton.top = (window.innerWidth)/10;
        this.styleButton(this.restartButton,"Restart");
        this.guiMenu.addControl(this.restartButton);

        this.goToMenuButton = Button.CreateSimpleButton("goToMenuButton","Main Menu");
        this.goToMenuButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.goToMenuButton.top =-(window.innerWidth/20);
        this.styleButton(this.goToMenuButton,"Main Menu");
        this.guiMenu.addControl(this.goToMenuButton);
         
        this.onResize();

        window.addEventListener("resize", () => {
               this.onResize();
           });
    }

    private styleMessage(){
        this.message.text="Game Over!";
        this.message.color="#3CB043";
        this.message.width = 0.8*window.innerWidth;
        this.message.fontSize = 0.12*window.innerWidth;
        this.message.fontFamily ="Agency FB";
        this.message.textHorizontalAlignment =Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.message.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.message.paddingTop = `${window.innerHeight * 0.2}px`; 

    }

    private styleButton(button:Button,text:string){
        let fontSizePercentage =0.06;
        button.color="white";
        button.fontFamily="Agency FB";
        button.fontSizeInPixels=((window.innerHeight+window.innerWidth)/2)*fontSizePercentage;
        button.height = 0.12;
        button.width =0.4;
        button.thickness=0;
        button.onPointerEnterObservable.add(() => {
            if (button.textBlock) {
                button.textBlock.text = `▶ ${text }`;
            }
            button.color = "#3CB043";
        });

        button.onPointerOutObservable.add(() => {
            if (button.textBlock) {
                button.textBlock.text = text;
            }
            button.color ="white";
        });
    }

    private onResize() {
        this.message.width = 0.8*window.innerWidth;
        this.message.fontSize = 0.12*window.innerWidth;
        this.message.paddingTop = `${window.innerHeight * 0.2}px`; 
        this.restartButton.fontSizeInPixels=((window.innerHeight+window.innerWidth)/2)*0.05;
        this.restartButton.top = (window.innerWidth)/10;
        this.restartButton.height = 0.2;
        this.restartButton.width =0.6;
        this.goToMenuButton.width=0.6;
        this.goToMenuButton.height=0.2;
        this.goToMenuButton.top =-(window.innerWidth/20);
        this.goToMenuButton.fontSizeInPixels=((window.innerHeight+window.innerWidth)/2)*0.05;

    }

    public getRestartButton(){
        return this.restartButton;
    }

    public getMenuButton(){
        return this.goToMenuButton;
    }

    public hide(){
        this.guiMenu.dispose();
    }

}

