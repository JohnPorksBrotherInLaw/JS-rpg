import * as me from 'melonjs';

//the joystick on the screen for mobile
const joystickContainer = document.getElementById('joystick-container');
const joystickHandle = document.getElementById('joystick-handle');
const joystickBase = document.getElementById('joystick-base');
        
const baseRect = joystickBase.getBoundingClientRect();
const baseSize = baseRect.width;
const centerX = baseRect.left + baseSize / 2;
const centerY = baseRect.top + baseSize / 2;
const maxDistance = baseSize / 3;
        
let activeTouchId = null;
        
    // Output values
const joystickOutput = {
    x: 0,
    y: 0,
    angle: 0,//used to determine what animation
};
        
function updateJoystickOutput(clientX, clientY) {
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
            
    const angle = Math.atan2(dy, dx);
    const magnitude = distance / maxDistance;
            
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
        
// Touch events
joystickContainer.addEventListener('touchstart', (e) => {   
    if (activeTouchId === null) {
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        updateJoystickOutput(touch.clientX, touch.clientY);
        e.preventDefault();
    }
},{passive : false});
        
joystickContainer.addEventListener('touchmove', (e) => {    
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === activeTouchId) {
            updateJoystickOutput(touch.clientX, touch.clientY);
            e.preventDefault();
            break;
        }
    }
},{passive : false});
        
joystickContainer.addEventListener('touchend', (e) => {    
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
        
// Detect touch device and show joystick if needed
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}
if (isTouchDevice()) {
    joystickContainer.style.display = 'block';
}

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

        // add a physic body with a diamond as a body shape
       
        this.body = new me.Body(this, (new me.Rect(16, 16, 16, 16)));
        this.body.gravityScale = 0;
        // walking & jumping speed
        this.body.setMaxVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);


        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // enable keyboard
        if(!isTouchDevice()){
            me.input.bindKey(me.input.KEY.LEFT,  "left");
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.UP,    "up");
            me.input.bindKey(me.input.KEY.DOWN,  "down");
            me.input.bindKey(me.input.KEY.Z, "accept");
            me.input.bindKey(me.input.KEY.Z, "decline");
        }
        // define an additional basic walking animation
        this.addAnimation("walk_left",  [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
        this.addAnimation("walk_right", [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]);
        this.addAnimation("walk_up",    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
        this.addAnimation("walk_down",  [0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11]);
        // set default one
        this.setCurrentAnimation("walk_down");
    }

    /**
     * update the player pos
     */
    update(dt) {
        if(!isTouchDevice()){
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
        }else{
            if(!(joystickOutput.x == 0 && joystickOutput.y == 0)){
                this.body.force.x = joystickOutput.x * this.body.maxVel.x;
                this.body.force.y = joystickOutput.y * this.body.maxVel.y;
                //pi * 0.25 = 0.78539816339744830961566084581988
                //pi *0.75 = 2.3561944901923449288469825374596
                if(joystickOutput.angle <= -2.357 || joystickOutput.angle > 2.357){
                    if (!this.isCurrentAnimation("walk_left")) {
                    this.setCurrentAnimation("walk_left");
                    }
                }else if(joystickOutput.angle <= -0.785){
                    if (!this.isCurrentAnimation("walk_up")) {
                    this.setCurrentAnimation("walk_up");
                    }
                }else if(joystickOutput.angle <= 0.785){
                    if (!this.isCurrentAnimation("walk_right")) {
                    this.setCurrentAnimation("walk_right");
                    }
                }else /*if(joystickOutput.angle <= 2.357){*/
                    if (!this.isCurrentAnimation("walk_down")) {
                    this.setCurrentAnimation("walk_down");
                    }
                //}
                
            }
        }
        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            super.update(dt);
            return true;
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
};

//things you can interact and talk to like in rpgmaker
export class NPCEntity extends me.Sprite{
    constructor(x,y,settings){
         // call the constructor
        super(x, y,
            Object.assign({
                image: "npc0",
                framewidth: 32,
                frameheight: 32,
                interactradius: 64,
                player: null,
            }, settings)
        );
        this.body = new me.Body(this, (new me.Rect(16, 16, 16, 16)));
        this.body.gravityScale = 0;
    }
    update(dt){
        //see if the character is close enough to interact
        if(this.player != null){
        let newx = player.x - x;
        let newy = player.y - y;
        if(Math.sqrt(newx * newx + newy * newy) < interactradius){
            if(me.input.isKeyPressed("accept")){
                console.log("Hello World");
            }
        }        
    }
}
}