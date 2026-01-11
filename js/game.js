var game = {
    isTouchDevice: false,
    vw: 9,
    vh:5,
    disallowMovement: false,
    acceptPressed:false,
    declinePressed:false,
    playerRef : null,
    playerXCoord : 0,
    playerYCoord : 0,
    UITextureAtlas:null,
    DialogueNamesTextureAtlas:null,
    paused:false,//is pause menu showing?
    PauseMenu:null,//ref to pase menu
    DialogueGUI:null,//ref to the dialogue on screen   
    CurChapter:null,//ref to the current chapter scenes (to save on writing all the time)
    CurScene:0,//current scene of the chapter
    currentInteractableNPC:"",//the name of the JSON that will be activated on accept
    currentDoor:null,
    hideMobileControls:false,
    playerTalkingSpriteAtlas:null,
}
export default game;