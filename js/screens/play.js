import * as me from 'melonjs';
import * as GUI from '../entities/gui.js';
import * as Ent from '../entities/entities.js';
import game from '../game.js';
class PlayScreen extends me.Stage {

    //set constant values for things while the game is playing (under normal conditions)
      // action to perform on state change
     
    onResetEvent() {

        // disable gravity
        me.game.world.gravity.set(0, 0);

        //init doors   
        me.pool.register("DOOR_Gym",Ent.Door,true);
        me.pool.register("DOOR_GymHallway",Ent.Door,true);
        me.pool.register("DOOR_ClassroomA",Ent.Door,true);
        me.pool.register("DOOR_ClassroomAHallway",Ent.Door,true);
        me.pool.register("DOOR_ClassroomB",Ent.Door,true);
        me.pool.register("DOOR_ClassroomBHallway",Ent.Door,true);
        me.pool.register("DOOR_ClassroomC",Ent.Door,true);
        me.pool.register("DOOR_ClassroomCHallway",Ent.Door,true);
        // load a level
        me.level.load("floor1");
        
        // register on mouse event
        
       if(me.device.isMobile){
            this.InitMobileControls();  
            //we getting rid of the joystick. use the tap location to move in the direction
            me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
                me.event.emit("pointermove", event);
            }, false);
       }
    };
constructor(){
    super();
    this.InitMobileControls = () =>{
        console.log("initializing mobile control layout");

        //create some ui holder for my things (perhpas i dont need this)        
        let panel = new GUI.UIContainer(0,0,1,1,game.UITextureAtlas,"transparent",false,false,"mobilecontrols");

        panel.addChild(new GUI.ButtonUI(700,270,"acceptbutton",() => {
            console.log("yes");
            game.acceptPressed = true;        
        }, () => {
            game.acceptPressed = false;       
        }));
   
        panel.addChild(new GUI.ButtonUI(650,300,"declinebutton",() => {
            console.log("no");
            game.declinePressed = true;         
        }, () => {
            game.declinePressed = false;         
        }));        
        
        me.game.world.addChild(panel, 10);
   };
  }
};

export default PlayScreen;