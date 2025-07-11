import * as me from 'melonjs';
import game from '../game.js';
import * as GUI from './gui.js';

// a player entity
export class PlayerEntity extends me.Sprite {

    constructor(x, y, settings) {
        // call the constructor
        super(x, y,
            Object.assign({
                image: "Blank_Sprite_Sheet",
                framewidth: 32,
                frameheight: 32
            }, settings)
        );        

        // add a physic body with a rect as a body shape
        this.body = new me.Body(this, (new me.Rect(16, 16, 16, 16)));
        // walking & jumping speed
        this.body.setMaxVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);
        // subscribe to pointer move event
        this.pointerEvent = me.event.on("pointermove", this.pointerMove, this);
        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        this.doAccept = function(){            
            if(game.currentInteractableNPC !== ""){                
                if(game.DialogueGUI === null){                   
                    game.DialogueGUI = me.pool.pull("DialogueScreen");
                   // console.log("nimue");
                }else{
             //       console.log(game.DialogueGUI);
                    game.DialogueGUI.Advance();
                }
            }
        };
        this.doDecline = function(){

        };
        // enable keyboard
       // if(game.isTouchDevice){
            me.input.bindKey(me.input.KEY.LEFT,  "left");
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.UP,    "up");
            me.input.bindKey(me.input.KEY.DOWN,  "down");
            me.input.bindKey(me.input.KEY.Z, "accept",true);
            me.input.bindKey(me.input.KEY.X, "decline",true);
            me.event.on(me.event.KEYDOWN, (action, keyCode, edge) => {
              if (action === "accept" && game.acceptPressed === false) {
                  this.doAccept();
                  game.acceptPressed = true;
              }
              else if (action === "decline" && game.declinePressed  === false) {
                  this.doDecline();
                  game.declinePressed = true;
              }
            });
            me.event.on(me.event.KEYUP,(action,keyCode) => {
                if(action === "accept") game.acceptPressed = false;
                else if(action === "decline") game.declinePressed  = false;
            });
        //}
        // define an additional basic walking animation
        this.addAnimation("walk_left",  [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
        this.addAnimation("walk_right", [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
        this.addAnimation("walk_up",    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
        this.addAnimation("walk_down",  [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11]);
        // set default one
        this.setCurrentAnimation("walk_down");
    }

    update(dt) {        
        if(!game.disallowMovement){
            if (me.input.isKeyPressed("left")) {
                // update the entity velocity
                this.body.force.x = -this.body.maxVel.x;
                if (!this.isCurrentAnimation("walk_left")) {
                    this.setCurrentAnimation("walk_left");
                }
            } else if (me.input.isKeyPressed("right")) {
            // update the entity velocity
            this.body.force.x = this.body.maxVel.x;
            if (!this.isCurrentAnimation("walk_right")) {
                this.setCurrentAnimation("walk_right");
            }
            } else {
                this.body.force.x = 0;
            }
            if (me.input.isKeyPressed("up")) {
                // update the entity velocity
                this.body.force.y = -this.body.maxVel.y;
                if (!this.isCurrentAnimation("walk_up") && this.body.vel.x === 0) {
                    this.setCurrentAnimation("walk_up");
                }
            } else if (me.input.isKeyPressed("down")) {
            // update the entity velocity
            this.body.force.y = this.body.maxVel.y;
            if (!this.isCurrentAnimation("walk_down") && this.body.vel.x === 0) {
                this.setCurrentAnimation("walk_down");
            }
            } else {
                this.body.force.y = 0;
            }
        }

        //}
        //instead of having a public static playerreference which is fucking impossible for some reason
        //ill just upload the x and y coords to game instead
        game.playerXCoord = this.pos.x;
        game.playerYCoord = this.pos.y;
        //console.log(this.pos);
        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            super.update(dt);
            return true;
        }
    }
    pointerMove(event) {
        if(!game.disallowMovement){
        let dir = new me.Vector2d(event.gameWorldX - this.pos.x,event.gameWorldY - this.pos.y).normalize();
        const angle = Math.atan2(dir.y,dir.x);
        this.body.force.x = dir.x * this.body.maxVel.x;
        this.body.force.y = dir.y * this.body.maxVel.y;
                //pi * 0.25 = 0.78539816339744830961566084581988
                //pi *0.75 = 2.3561944901923449288469825374596
        if(angle <= -2.357 || angle > 2.357){
                    if (!this.isCurrentAnimation("walk_left")) {
                    this.setCurrentAnimation("walk_left");
                    }
                }else if(angle<= -0.785){
                    if (!this.isCurrentAnimation("walk_up")) {
                    this.setCurrentAnimation("walk_up");
                    }
                }else if(angle <= 0.785){
                    if (!this.isCurrentAnimation("walk_right")) {
                    this.setCurrentAnimation("walk_right");
                    }
                }else if (!this.isCurrentAnimation("walk_down")) {
                    this.setCurrentAnimation("walk_down");
                }
            }
    }
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision(/*response, other*/) {
        // Make all other objects solid
        return true;
    }

}

//things you can interact and talk to like in rpgmaker
export class NPCEntity extends me.Sprite{

    constructor(x,y,settings){
         // call the constructor
        super(x, y,
            Object.assign({
                image: "npc0",
                framewidth: 32,
                frameheight: 32,
            }, settings)
        );
        this.interactradius = 64;
        this.body = new me.Body(this, (new me.Rect(16, 16, 16, 16)));
    }

    update(dt){
            //see if the character is close enough to interact
            let newx = game.playerXCoord - this.pos.x;
            let newy = game.playerYCoord - this.pos.y;

            
                if(Math.sqrt(newx * newx + newy * newy) < this.interactradius){
                    //GUI.ShowDialogueBox("testMap-npc0");
                    game.currentInteractableNPC = "testMap-npc0";
                }else{
                    game.currentInteractableNPC = "";
                }
           

        super.update(dt);
    }
}
