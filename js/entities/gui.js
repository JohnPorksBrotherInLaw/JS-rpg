import * as me from 'melonjs';
import game from "../game.js";

const vw = game.vw;
const vh = game.vh;
// a Panel type container
export class UIContainer extends me.UIBaseElement {

    constructor(x, y, width, height, atlas, frame, holdable = false, dragable = false, Name = "") {
        // call the constructor
        super(x, y, width, height);

        // [0, 0] as origin
        this.anchorPoint.set(0, 0);

        // give a name
        this.name = Name;

        // back panel sprite
        this.addChild(atlas.createSpriteFromName(
            frame,
            { width : this.width, height : this.height},
            true
        ));

        // input status flags
        this.isHoldable = holdable;

        // panel can be dragged
        this.isDraggable = dragable;
    };

};

export class ButtonUI extends me.UISpriteElement {
    //simplified version of buttonui from the example. removed usage of multiple sprites for ease of mind
    constructor(x,y,pic,/*label,*/onclick,onrelease){
         super(x, y, {
            image: game.UITextureAtlas,
            region: pic
        });

        // offset of the two used images in the texture
        this.clickEvent = onclick;
        this.releaseEvent = onrelease;
        this.anchorPoint.set(0, 0);
        this.setOpacity(0.5);

        this.font = new me.Text(0, 0 ,{
            font: "sansserif",
            size: 12,
            fillStyle: "black",
            textAlign: "center",
            textBaseline: "middle",
            offScreenCanvas: (me.video.renderer.WebGLVersion >= 1)
        });

        //this.label = label;

        // only the parent container is a floating object
        this.floating = false;
    }
    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick() {
        this.clickEvent();
        return false;
    }

    /**
     * function called when the pointer button is released
     */
    onRelease(/* event */) {
        if(this.releaseEvent != undefined){
            this.releaseEvent();
        }
        return false;
    }

    draw(renderer) {
        super.draw(renderer);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    }

    /**
     * OnDestroy Notification function
     */
    onDestroyEvent() {
        this.font.destroy();
        this.font = null;
    }

};
export class CheckBoxUI extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y, texture, on_icon, off_icon, on_label, off_label,variable,onValue,offValue) {

        // call the parent constructor
        super(x, y, {
            image: texture,
            region : on_icon // default
        });

        // offset of the two used images in the texture
        this.on_icon_region = texture.getRegion(on_icon);
        this.off_icon_region = texture.getRegion(off_icon);

        //this.anchorPoint.set(0.5, 0);
        this.setOpacity(0.5);
        this.variable = variable;
        this.onValue = onValue;
        this.offValue = offValue;
        this.isSelected = true;

        this.label_on = on_label;
        this.label_off = off_label;

        this.font = new me.Text(0, 0 ,{
            font: "sansserif",
            size: 12,
            fillStyle: "black",
            textAlign: "left",
            textBaseline: "middle",
            text: this.label_off,
            offScreenCanvas: true
        });

        // extend the button Bounding Box to include the label size
        this.getBounds().width += this.font.measureText().width;

        // only the parent container is a floating object
        this.floating = false;
    }
    /*
    example usage:
     me.UIBaseElement.addChild(new CheckBoxUI(
            0, 0,
            game.UITextureAtlas,
            "green_button04",
            "green_button04",
            "fullscreen ON", // default
            "fullscreen OFF",
            game.isFullscreen,
            true,
            false
        ));
    */

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * change the checkbox state
     */
    setSelected(selected) {
        if (selected) {
            this.setRegion(this.on_icon_region);
            this.isSelected = true;
            this.variable = this.onValue;
        } else {
            this.setRegion(this.off_icon_region);
            this.isSelected = false;
            this.variable = this.offValue;
        }
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        this.setSelected(!this.isSelected);
        // don't propagate the event
        return false;
    }

    draw(renderer) {
        super.draw(renderer);
        this.font.draw(renderer,
            " " + (this.isSelected ? this.label_on : this.label_off),
            this.pos.x + this.width,
            this.pos.y + this.height / 2
        );
    }
};
//custom find function
function findit(a,b,LENGTH){
    for (let i = 0; i < LENGTH; i++) {        
        if(a.ts === b[i].activeAtlas)
            return b[i];
    }   
}

//this needs to be a class so that i can reference the uielements directly.
export class DialogueGUI extends UIContainer{
    constructor(){
        super(0,0,1,1,game.UITextureAtlas,"transparent",false,false,"DialogueScreen");        
        this.currentDialogueFrame = 0;
        this.currentDialogueSequence = null;
        this.lastTS = "";//ts of last frame
        this.nextchar = false;//use left or right char to display talkingspite?
        this.talkingSpriteAtlases = [];
        this.rchar = null;
        this.lchar = null;
        this.namepanel = null;
        this.Text = null;
        this.textbkg = null;
        this.Init();
    }
    Init(){
        console.log("showing dialogue box");
        game.disallowMovement = true;
        //get the json that the textbox is referencing and obtain the text
        this.currentDialogueSequence = me.loader.getJSON(game.currentInteractableNPC);
        this.currentDialogueFrame = 0;
        this.lastTS = "";
        this.nextchar = false;
        //get all associated data

        this.talkingSpriteAtlases = []; //talking sprite atlases
        for (let i = 0; i < this.currentDialogueSequence.talkingSpriteJsons.length; i++){
            this.talkingSpriteAtlases.push(new me.TextureAtlas(
                // me.loader.getImage(json.talkingSprite),
                me.loader.getJSON(this.currentDialogueSequence.talkingSpriteJsons[i])
            ));
        }

        // t means text, ts means talking sprite, r means region
        //empty holder object
        //this.panel = new UIContainer(0,0,1,1,game.UITextureAtlas,"transparent");
        //the right character
        this.rchar = this.addChild(me.pool.pull("DialogueCharacter",vw*80,vh*70,{
            image : findit(this.currentDialogueSequence.dialogue[this.currentDialogueFrame],this.talkingSpriteAtlases,this.talkingSpriteAtlases.length),
            region : this.currentDialogueSequence.dialogue[0].r,
            name : "rchar",
            anchorPoint : new me.Vector2d(0.5,1)
        }));
        this.lchar = null;
        //textbox
        this.textbkg = this.addChild(new UIContainer(vw*5, vh*70, vw*90, vh*30,game.UITextureAtlas,"whitebox"));
        //charcter name sprite
        
        this.namepanel = this.addChild(new me.Sprite(vw*7,vh*52,{
            image : game.DialogueNamesTextureAtlas,
            region : this.currentDialogueSequence.dialogue[0].ts,
            name: "name",
            anchorPoint : new me.Vector2d(0,1)
        }));
        this.Text = this.addChild(new me.Text(vw*6.5,vh*73,{
            font:"sansserif",
            size: 18,
            fillStyle: "black",
            textAlign: "left",
            textBaseline: "top",
            text: this.currentDialogueSequence.dialogue[0].t
        }));
        this.lastTS = this.currentDialogueSequence.dialogue[0].ts;
        // add the panel to world (root) container
        me.game.world.addChild(this, 16);
    }
    Advance(){
        this.currentDialogueFrame++;
        if(this.currentDialogueSequence.dialogue.length === this.currentDialogueFrame){
            console.log("Destroying DialogueScreen");
            game.disallowMovement = false;           
            me.game.world.removeChild(game.DialogueGUI);                            
        } else{
            const f = this.currentDialogueSequence.dialogue[this.currentDialogueFrame];//f for frame
            //console.log(f);
            
            this.Text.setText(f.t);            
            //check which ts is on the frame. if neither dialoguecharacter is has that ts,
            //then replace the previously used dc with the new one and alter the name from there
            if(f.ts !== undefined){//you can leave ts as undefined if the same character talks twice in a row
                if(this.lastTS !== f.ts){
                    if(this.lchar === null){
                //      console.log("amet");
                        this.lchar = this.addChild(me.pool.pull("DialogueCharacter",vw*20,vh*70,{
                            image : findit(f,this.talkingSpriteAtlases,this.talkingSpriteAtlases.length),
                            region : f.r,
                            name : "lchar",
                            anchorPoint : new me.Vector2d(0.5,1)
                        }),0);                
                        this.nextchar = true; 
                    // this.panel.moveToBottom(this.panel.getChildByName("lchar"));
                        //console.log(this.namepanel);
                        this.namepanel.setRegion(game.DialogueNamesTextureAtlas.getRegion(f.ts));
                    } else if(this.rchar.source.activeAtlas === f.ts){
                //  console.log("lorem");
                        this.rchar.region = f.r;//edit their stance
                        this.nextchar = false;//set the opposite char to be the one to be swapped if necessary
                        if(this.lastTS !== f.ts){
                            //update name if itsn different than last time                   
                            this.namepanel.setRegion(game.DialogueNamesTextureAtlas.getRegion(f.ts)); 
                        }
                    //  console.log(this.rchar);
                    } else if(this.lchar.source.activeAtlas === f.ts)  {
                //   console.log("ipsum");
                        this.lchar.region = f.r;
                        this.nextchar = true;
                        if(this.lastTS !== f.ts){
                            //update name if its different than last time                   
                            this.namepanel.setRegion(game.DialogueNamesTextureAtlas.getRegion(f.ts));
                        }
                    }  else {
                        //edit previous unused ts. similar to cookie run kingdom
                        if(this.nextchar){
                            //use rchar
                        //    console.log("dolor");
                            //destroy rchar and recreate it. changing the textureatlas is against the rules
                            this.removeChild(this.rchar);
                            this.rchar = this.addChild(me.pool.pull("DialogueCharacter",w*65,vh*7,{
                                image : findit(f,this.talkingSpriteAtlases,this.talkingSpriteAtlases.length),
                                region : f.r,
                                name : "rchar",
                            anchorPoint : new me.Vector2d(0.5,1)
                            }));                    
                            this.nextchar = false;
                        }else{
                            //use lchar
                    // console.log("sit");
                            this.removeChild(this.lchar);                 
                            this.lchar = this.addChild(me.pool.pull("DialogueCharacter",vw*15,vh*7,{
                                image : findit(f,this.talkingSpriteAtlases,this.talkingSpriteAtlases.length),
                                region : f.r,
                                name : "lchar",
                            anchorPoint : new me.Vector2d(0.5,1)
                            }));                
                            this.nextchar = true;                   
                        }                
                        //update name if itsn different than last time
                        this.namepanel.setRegion(game.DialogueNamesTextureAtlas.getRegion(f.ts));                
                    }
                }
            }
            this.lastTS = f.ts;
        }
    }
    onResetEvent(){
        this.Init();
    }
    onDeactivateEvent(){
        this.removeChild(this.lchar);
        this.removeChild(this.namepanel);
        game.DialogueGUI = null;
        //console.log(game);
    }
}
/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.*/