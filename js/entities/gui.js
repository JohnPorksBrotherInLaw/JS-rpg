import * as me from 'melonjs';
import game from "../game.js";

// a Panel type container
export class UIContainer extends me.UIBaseElement {

    constructor(x, y, width, height, atlas, frame, holdable = false, dragable = false) {
        // call the constructor
        super(x, y, width, height);

        // [0, 0] as origin
        this.anchorPoint.set(0, 0);

        // give a name
        //this.name = "UIPanel";

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

export function ShowDialogueBox(inputJson){
    if(!game.dialogueBoxShown){
        let vw = game.vw;
        let vh = game.vh;
        game.dialogueBoxShown = true;
        console.log("showing dialogue box");
        game.disallowMovement = true;
        //get the json that the textbox is referencing and obtain the text
        const json = me.loader.getJSON(inputJson);
        game.talkingSpriteAtlas = new me.TextureAtlas(
           // me.loader.getImage(json.talkingSprite),
            me.loader.getJSON(json.talkingSpriteJson)
        )
        console.log(game.talkingSpriteAtlas)
        let panel = new UIContainer(0,0,1,1,game.UITextureAtlas,"transparent");
        panel.addChild(new me.Sprite(vw*65,vh*7,{
            image : game.talkingSpriteAtlas,
            region : "normal",
            }));
        panel.addChild(new UIContainer(vw*5, vh*70, vw*90, vh*30,game.UITextureAtlas,"whitebox"));
        panel.addChild(new me.Text(vw*7,vh*62,{
            font:"sansserif",
            size: 40,
            fillStyle: "black",
            textAlign: "left",
            textBaseline: "top",
            bold: true,
            text: json.name}))
        panel.addChild(new me.Text(vw*6.5,vh*73,{
            font:"sansserif",
            size: 18,
            fillStyle: "black",
            textAlign: "left",
            textBaseline: "top",
            text: json.dialogue[0][0]}));
        // add the panel to word (root) container
        me.game.world.addChild(panel, 16);
    }
}
