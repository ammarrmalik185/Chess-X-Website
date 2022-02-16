class tableGridDataContainer {
    constructor(){

    }
}

let tableGridData;
let currentGameData;
let tableDatabaseReference;
let defaultTableHtml;

function setup() {
    createNewTableGrid();
    defaultTableHtml = document.getElementById("mainGameContainer").innerHTML;
}

function onPageUnload(){
    leaveTable();
    if (currentGameData && currentGameData.running === true) {
        if (currentUserData.authType === "verified")
        firebase.database().ref().child("userData").child(currentUserData.user.uid).child("lastPlayedGame").set(
            tableDatabaseReference.key
        );
    }
}

function pushToDatabase() {
    tableDatabaseReference.child("liveTableData").set(tableGridData);
}

function addDatabaseActionListeners(){
    tableDatabaseReference.on("value", (snapshot) => {
        resetTable();
        if (snapshot.exists()){
            if ((currentUserData.currentPlayerNumber !== "spectator" && snapshot.child(currentUserData.currentPlayerNumber).exists())
            || (currentUserData.currentPlayerNumber === "spectator" && snapshot.child("spectators").child(currentUserData.user.uid).exists())
            ){
                if(currentGameData)
                    checkForNewPlayers(snapshot);
                if(snapshot.child("winner").exists()){
                    if (currentUserData.currentPlayerNumber === "spectator")
                        showMatchEndDialogSpectator(snapshot);
                    else if (snapshot.child("winner").val() === currentUserData.currentPlayerNumber
                        && !snapshot.child(currentUserData.currentPlayerNumber + "statsCounted").exists()) {
                        showMatchEndDialog("Won");
                        tableDatabaseReference.child(currentUserData.currentPlayerNumber + "statsCounted").set(true);
                    }
                    else if (!snapshot.child(currentUserData.currentPlayerNumber + "statsCounted").exists()) {
                        showMatchEndDialog("Lost");
                        tableDatabaseReference.child(currentUserData.currentPlayerNumber + "statsCounted").set(true);
                    }
                }
                createNewTableGrid();
                tableGridData = snapshot.val()["liveTableData"];
                currentGameData = snapshot.val();
                if (currentUserData.currentPlayerNumber !== "spectator" &&
                    currentGameData[currentUserData.currentPlayerNumber].joinType === "Host"){
                    changePermissionsToHost();
                }else{
                    changePermissionsToNormal();
                }
                renderTableGridPieces();
                setupPlayerData();
                setTurnValues();
                renderMessages();
                if(detectCheckMate(currentGameData[currentUserData.currentPlayerNumber].color))
                    forfeitMatch();
            }else{
                showSnackbarAlert("Kicked by Host");
                leaveTable();
            }
        }else {
            showSnackbarAlert("Table Deleted by host");
            tableDatabaseReference.off();
        }
    });
}

function showSnackbarAlert(message){
    let snackBar = document.getElementById("snackbar");
    snackBar.innerText = message;
    snackBar.className = "show";

    setTimeout(function(){
            snackBar.className = snackBar.className.replace("show", "");
        }, 3000
    );
}

function resetTable() {
    document.getElementById("mainGameContainer").innerHTML = defaultTableHtml;
}

function runTest() {
    // console.log("black");
    // detectCheckMate("black")
}

function runTest2() {
    // console.log("white");
    // detectCheckMate("white")
}

setup();