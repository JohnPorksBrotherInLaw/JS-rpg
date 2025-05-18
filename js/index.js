import * as me from 'melonjs';
import resources from './resources.js';
//import PlayScreen from './screens/play.js';
import { NPCEntity, PlayerEntity } from './entities/entities.js';


//Initialize the application

export default function onload () {
    // init the video
    if (!me.video.init(800, 400, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // set all ressources to be loaded
    me.loader.preload(resources, () => {
        // set the "Play/Ingame" Screen Object
          
        me.level.load("testMap");
        //me.state.set(me.state.PLAY, new PlayScreen());

        // set the fade transition effect
        me.state.transition("fade","#FFFFFF", 250);

        // register our objects entity in the object pool
        me.pool.register("mainPlayer", PlayerEntity);    
        me.pool.register("npc0", NPCEntity); 
        //me.state.change(me.state.PLAY);         
    });
    //init npcs
   // let AllChildren = me.game.world.getChildren();    
    //for (let i = 0; i < AllChildren.length; i++) {
   //     const element = AllChildren[i];
      //  if(element.class == "npc"){
    //        //me.pool.register("npc"+element.name,NPCEntity);
            //new NPCEntity(element.x,element.y,{image: "npc" + element.name});
      //  }
   // }
    
       
  
    
};