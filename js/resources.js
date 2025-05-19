var resources = [

    /* Graphics.
     * @example
     * { name: "example", type:"image", src: "data/img/example.png" },
     */
    { name: "testTileMap",  type:"image", src: "data/img/testTileMap.png" },  
    { name: "npc0",  type:"image", src: "data/img/npc0.png" },  
    { name: "Blank_Sprite_Sheet", type:"image", src: "data/img/Blank_Sprite_Sheet_4_2_by_KnightYamato.png" },
    {name:"UIAtlas", type:"image", src: "data/img/UIAtlas.png"},

    /* Maps.
     * @example
     * { name: "example01", type: "tmx", src: "data/map/example01.tmx" },
     * { name: "example01", type: "tmx", src: "data/map/example01.json" },
      */
    { name: "testMap", type: "tmx", src: "data/map/testMap.tmx" },

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
    {name:"testMap-npc0",type:"json", src:"data/npc/testMap-npc0.json"},
    {name:'uiatlas',type:'json',src:'data/img/UIAtlas.json'},

];

export default resources;
