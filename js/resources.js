var resources = [

    /* Graphics.
     * @example
     * { name: "example", type:"image", src: "data/img/example.png" },
     */
    { name: "testTileMap",  type:"image", src: "data/img/testTileMap.png" },


    //{ name: "Blank_Sprite_Sheet", type:"image", src: "data/img/Blank_Sprite_Sheet_4_2_by_KnightYamato.png" },
    {name:"player", type : "image", src : "data/img/player.png"},
     {name:"playerTalkingSprite", type : "image", src : "data/img/playerTalkingSprite.png"},
    {name:'playerTalkingSpriteJson',type:'json',src:'data/img/playerTalkingSprite.json'},

    {name:"UIAtlasImg", type:"image", src: "data/img/UIAtlas.png"},
    {name:'UIAtlasJson',type:'json',src:'data/img/UIAtlas.json'},
    {name:"DialogueNames", type:"image", src: "data/img/DialogueNames.png"},
    {name:'DialogueNamesJson',type:'json',src:'data/img/DialogueNames.json'},
    /* Maps.
     * @example
     * { name: "example01", type: "tmx", src: "data/map/example01.tmx" },
     * { name: "example01", type: "tmx", src: "data/map/example01.json" },
      */
    //{ name: "testMap", type: "tmx", src: "data/map/testMap.tmx" },
    { name: "floor1", type: "tmx", src: "data/map/floor1.tmx" },
    
    {name:"Chapter1",type :"json",src:"data/story/chapter1.json"},
    /* Background music.
     * @example
     * { name: "example_bgm", type: "audio", src: "data/bgm/" },
     */

    /* Sound effects.
     * @example
     * { name: "example_sfx", type: "audio", src: "data/sfx/" }
     */

     // font face
    //{ name: "parisVanJava", type: "fontface",  src: "data/font/ParisVanJava.ttf" },

    /* Atlases
     * @example
     *{ name: "example_tps", type: "json", src: "data/img/example_tps.json" },
     */
    { name: "npc0",  type:"image", src: "data/img/npc0.png" },
    {name:"testMap-npc0",type:"json", src:"data/npc/testMap-npc0.json"},
     {name:"npc0TalkingSprite", type : "image", src : "data/img/npc0TalkingSprite.png"},
    {name:'npc0TalkingSpriteJson',type:'json',src:'data/img/npc0TalkingSprite.json'},



];

export default resources;
