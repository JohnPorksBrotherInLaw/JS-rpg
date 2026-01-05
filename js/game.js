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
    paused:false,
    PauseMenu:null,
    DialogueGUI:null,//ref to the dialogue on screen    
    currentInteractableNPC:"",//the name of the JSON that will be activated on accept
    currentDoor:null,
    hideMobileControls:false,
    CurChapter:null,
}
export default game;