var game = {
    vw: 8,
    vh:4,
    disallowMovement: false,
    acceptPressed:false,
    declinePressed:false,
    playerXCoord : 0,
    playerYCoord : 0,
    UITextureAtlas:null,
    /*talkingSpriteAtlases:[],
    currentDialogueSequence:null,
    currentDialogueFrame:0,
    DialogueTextBox:null,
    DialogueName:null,
    DialogueCharacters:[null,null],//[right,left]
    NextDialogueCharacter:1,//0 is right, 1 is left*/
    currentInteractableNPC:"",//the name of the JSON that will be activated on accept
}
export default game;
