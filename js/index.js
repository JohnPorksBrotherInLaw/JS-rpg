import * as me from 'melonjs';
import resources from './resources.js';
import PlayScreen from './screens/play.js';
import { NPCEntity, PlayerEntity } from './entities/entities.js';
import * as GUI from './entities/gui.js';
import game from './game.js';
  
//Initialize the application
export default function onload() {
    // init the video
    if (!me.video.init(800, 400, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }  
    game.isTouchDevice = isTouchDevice();
    // set all ressources to be loaded
    me.loader.preload(resources, () => {        
        game.UITextureAtlas = new me.TextureAtlas([
           me.loader.getImage("UIAtlasImg"),   
            me.loader.getJSON("UIAtlasJson"), 
                    
        ]);
        // register our objects entity in the object pool  
        me.pool.register("mainPlayer", PlayerEntity);    
        me.pool.register("npc0", NPCEntity); 
        //me.level.load("testMap");
        
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());  
        me.state.change(me.state.PLAY);  
        // set the fade transition effect
        //me.state.transition("fade","#FFFFFF", 250);                       
    }); 
              
};
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}