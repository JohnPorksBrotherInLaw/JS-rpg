import * as me from 'melonjs';
import game from '../game.js';
import * as GUI from './gui.js';
//MOBILE CONTROLS FOR USE IN PLAYERENTITY
//I THINK POINTER EVENTS INCLUDE TOUCHSCREEN NOW THAT I THINK ABT IT
//I HAVE OTHER SHIT TO DO RN
// Detect touch device and show controls if needed
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

//the joystick on the screen for mobile
const DocBody = document.querySelector('body');
const MobileScreenControlsContainer = document.getElementById('mobile-screen-controls-container');
const joystickHandle = document.getElementById('joystick-handle');
const joystickBase = document.getElementById('joystick-base');        
let joystickbaseRect = joystickBase.getBoundingClientRect();
let joystickcenterX = joystickbaseRect.left + joystickbaseRect.width / 2;
let joystickcenterY = joystickbaseRect.top + joystickbaseRect.width / 2;
let joystickmaxDistance = joystickbaseRect.width / 3;

const acceptButton = document.getElementById('accept-button');
let acceptButtonRect = acceptButton.getBoundingClientRect();
let acceptPressed = false;
const declineButton = document.getElementById('decline-button');
let declineButtonRect = declineButton.getBoundingClientRect();
let declinePressed = false;
        
let activeTouchId = null;
if(isTouchDevice()){
MobileScreenControlsContainer.style.display = 'block';   
}     
    // Output values
const joystickOutput = {
    x: 0,
    y: 0,
    angle: 0,//used to determine what animation
};
        
function updateJoystickOutput(TX, TY) {
    //dont move joystick when you arent touching the joystick. give 30px of leyway
    if(TX < joystickbaseRect.left-30 || TX > joystickbaseRect.right+30 || TY > joystickbaseRect.bottom+30 || TY < joystickbaseRect.top-30) return; 
    const dx = TX - joystickcenterX;
    const dy = TY - joystickcenterY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), joystickmaxDistance);
            
    const angle = Math.atan2(dy, dx);
    const magnitude = distance / joystickmaxDistance;
            
    // Normalized values (-1 to 1)
    const normalizedX = magnitude * Math.cos(angle);
    const normalizedY = magnitude * Math.sin(angle);
            
    // Update output
    joystickOutput.x = normalizedX;
    joystickOutput.y = normalizedY;
    joystickOutput.angle = angle;     
            
    // Update handle position
    const handleX = distance * Math.cos(angle);
    const handleY = distance * Math.sin(angle);
    joystickHandle.style.transform = `translate(${handleX}px, ${handleY}px)`;
}
        
function resetJoystick() {
    joystickOutput.x = 0;
    joystickOutput.y = 0;
    joystickOutput.angle = 0;            
    joystickHandle.style.transform = 'translate(0, 0)';
}

function acceptButtonPress(TX,TY){
    if(TX >= acceptButtonRect.left && TX < acceptButtonRect.left + acceptButtonRect.width){
        if(TY >= acceptButtonRect.top && TY < acceptButtonRect.top + acceptButtonRect.height){
            
            acceptPressed = true;
            acceptButton.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            acceptButton.style.border = "2px solid rgba(255, 255, 255, 0.8)";    
        }
    }
}
function declineButtonPress(TX,TY){
    if(TX >= declineButtonRect.left && TX < declineButtonRect.left + declineButtonRect.width){
        if(TY >= declineButtonRect.top && TY < declineButtonRect.top + declineButtonRect.height){            
            declinePressed = true;
            declineButton.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            declineButton.style.border = "2px solid rgba(255, 255, 255, 0.8)";   
        }
    }
}
        
// Touch events
MobileScreenControlsContainer.addEventListener('touchstart', (e) => {   
    if (activeTouchId === null) {
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        updateJoystickOutput(touch.clientX, touch.clientY);
        e.preventDefault();
    }
},{passive : false});
        
MobileScreenControlsContainer.addEventListener('touchmove', (e) => {    
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === activeTouchId) {
            updateJoystickOutput(touch.clientX, touch.clientY);
            e.preventDefault();
            break;
        }
    }
},{passive : false});
        
MobileScreenControlsContainer.addEventListener('touchend', (e) => {    
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId) {
            resetJoystick();
            activeTouchId = null;
            e.preventDefault();
            break;
        }
    }
},{passive : false});  

acceptButton.addEventListener('touchstart', (e) => {
    if(activeTouchId === null) {
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        acceptButtonPress(touch.clientX, touch.clientY);
        e.preventDefault();
    }
},{passive:false});
declineButton.addEventListener('touchstart', (e) => {
    if(activeTouchId === null) {
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        declineButtonPress(touch.clientX, touch.clientY);
        e.preventDefault();
    }
},{passive:false});
acceptButton.addEventListener('touchend', (e) => {    
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId) {
            acceptPressed = false;
            acceptButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            acceptButton.style.border = "2px solid rgba(255, 255, 255, 0.5)";            
            activeTouchId = null;
            e.preventDefault();
            break;
        }
    }
},{passive : false});  
declineButton.addEventListener('touchend', (e) => {    
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId) {
            declinePressed = false;
            declineButton.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            declineButton.style.border = "2px solid rgba(255, 255, 255, 0.5)";   
            activeTouchId = null;
            e.preventDefault();
            break;
        }
    }
},{passive : false});  
DocBody.onresize = function(){
    console.log('Document has been resized');
    joystickbaseRect = joystickBase.getBoundingClientRect();
    joystickcenterX = joystickbaseRect.left + joystickbaseRect.width / 2;
    joystickcenterY = joystickbaseRect.top + joystickbaseRect.width / 2;
    joystickmaxDistance = joystickbaseRect.width / 3;
    acceptButtonRect = acceptButton.getBoundingClientRect();
    declineButtonRect = declineButton.getBoundingClientRect();
};

// a player entity
export class PlayerEntity extends me.Sprite {

    constructor(x, y, settings) {
        // call the constructor
        super(x, y,
            Object.assign({
                image: "player",
                framewidth: 23,
                frameheight: 42
            }, settings)
        );        

        // add a physic body with a rect as a body shape
        this.body = new me.Body(this, (new me.Rect(0, 30, 23, 12)));
        // walking & jumping speed
        this.body.setMaxVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);
        // subscribe to pointer move event
        this.pointerEvent = me.event.on("pointermove", this.pointerMove, this);
        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        this.doAccept = function(){            
            if(game.currentInteractableNPC !== ""){  
                const t = game.currentInteractableNPC.split("_");
                if(t[0] === "TALK")  {        
                    if(game.DialogueGUI === null){                   
                        game.DialogueGUI = me.pool.pull("DialogueScreen");
                    // console.log("nimue");
                    }else{
                //       console.log(game.DialogueGUI);
                        game.DialogueGUI.Advance();
                    }
                }else if (t[0]=== "DOOR") {
                    //console.log(game.currentDoor);
                    this.pos.x = game.currentDoor.exitXCoord;
                    this.pos.y = game.currentDoor.exitYCoord;
                }
            }
        };
        this.doDecline = function(){
            this.body.setMaxVelocity(5, 5);
        };
        // enable keyboard       
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
                else if(action === "decline"){
                     game.declinePressed  = false;
                     this.body.setMaxVelocity(2.5, 2.5);
                }
            });
        
        // define walking animations
        this.addAnimation("walk_left",[6,7,6,8],150);

        //i had errors with this line and i had to make the spritesheet one row bigger than it needs to be to patch it
        this.addAnimation("walk_right",[9,10,9,11],150);

        this.addAnimation("walk_up",[3,4,3,5],150);
        this.addAnimation("walk_down",[0,1,0,2],150);
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

    constructor(x,y,settings,Name,){
         // call the constructor
        super(x, y,
            Object.assign({
                image: Name,
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
            game.currentInteractableNPC = "testMap-npc0";
        }else{
            game.currentInteractableNPC = "";
        }
        super.update(dt);
    }
}
//interact with this 'npc' (image is baked in terrain) to travel to Exit
export class Door extends me.Renderable{
    constructor(x,y,a){
        super(x,y,0,0);
        this.interactradius = 64;        
        this.settings = a;        
        //settings holds all the data passed from tiled into the class (NOT XYWH) use that to get exitcoords
    }
    update(dt){
        let newx = game.playerXCoord - this.pos.x;
        let newy = game.playerYCoord - this.pos.y;            
        if(Math.sqrt(newx * newx + newy * newy) < this.interactradius){   
           // console.log(this.settings);            
            game.currentInteractableNPC = "DOOR_";
            game.currentDoor = this.settings;
        }else{
            game.currentInteractableNPC = "";
        }         
        super.update(dt);
    }
}