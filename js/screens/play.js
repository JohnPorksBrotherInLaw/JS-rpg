import * as me from 'melonjs';

class PlayScreen extends me.Stage {

    //set constant values for things while the game is playing (under normal conditions)
      // action to perform on state change
     
    onResetEvent() {

        // disable gravity
        me.game.world.gravity.set(0, 0);

        // load a level
        //me.level.load("testMap");

        // register on mouse event
        //me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
       //     me.event.emit("pointermove", event);
       // }, false);
    }

   
};

export default PlayScreen;