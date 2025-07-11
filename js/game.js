var game = {
    vw: 8,
    vh:4,
    disallowMovement: false,
    acceptPressed:false,
    declinePressed:false,
    playerXCoord : 0,
    playerYCoord : 0,
    UITextureAtlas:null,
    DialogueNamesTextureAtlas:null,
    DialogueGUI:null,//ref to the dialogue on screen    
    currentInteractableNPC:"",//the name of the JSON that will be activated on accept
}
export default game;