function startNewTableOpen(){

    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";

    let settingsContainer = document.createElement("div");
    let colorSelector = document.createElement("div");
    colorSelector.innerHTML = "<h1>Your starting color</h1>" +
        "<div class='radioSelection'>" +
        "<label class=\"checkMarkContainer\">White\n" +
        "<input type=\"radio\" name=\"color\" value=\"white\">\n" +
        "<span class=\"checkMark\" ></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">Black\n" +
        "<input type=\"radio\" name=\"color\" value=\"black\">\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">Random\n" +
        "<input type=\"radio\" checked=\"checked\" name=\"color\" value=\"random\">\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>" +
        "</div>";

    let spectatorSelector = document.createElement("div");
    spectatorSelector.innerHTML = "<h1>Allow Spectators</h1>" +
        "<div class='radioSelection'>" +
        "<label class=\"checkMarkContainer\">Yes\n" +
        "<input type=\"radio\" name=\"spectators\" value=true>\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">No\n" +
        "<input type=\"radio\" name=\"spectators\" value=false checked=\"checked\">\n" +
        "<span class=\"checkMark\" ></span>\n" +
        "</label>"+
        "</div>";


    let spectatorChat = document.createElement("div");
    spectatorChat.innerHTML = "<h1>Allow spectators to chat</h1>" +
        "<div class='radioSelection'>" +
        "<label class=\"checkMarkContainer\">Yes\n" +
        "<input type=\"radio\" name=\"spectatorChat\" value=true>\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">No\n" +
        "<input type=\"radio\" name=\"spectatorChat\" value=false checked=\"checked\">\n" +
        "<span class=\"checkMark\" ></span>\n" +
        "</label>"+
        "</div>";

    let tablePassword = document.createElement("div");
    tablePassword.innerHTML = "<h1>Table Password</h1>" +
        "<input type='password' id='newTablePassword' placeholder='Table Password(leave blank for no password)'>";

    let submitButton = document.createElement("button");
    submitButton.innerText = "Start Table";
    submitButton.addEventListener("click", makeNewTable);

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", ()=> {
        document.getElementById("inflatableDialog").style["display"] = "none";
    });

    settingsContainer.appendChild(colorSelector);
    settingsContainer.appendChild(spectatorSelector);
    settingsContainer.appendChild(spectatorChat);
    settingsContainer.appendChild(tablePassword);
    settingsContainer.appendChild(submitButton);
    settingsContainer.appendChild(cancelButton);
    inflatableDialogContent.appendChild(settingsContainer);

    document.getElementById("inflatableDialog").style["display"] = "block";
}

function makeNewTable(){

    leaveTable();
    if (!currentGameData || currentGameData.running === false) {
        let color = document.querySelector('input[name="color"]:checked').value;
        let spectatorsAllowed = document.querySelector('input[name="spectators"]:checked').value;
        let spectatorChat = document.querySelector('input[name="spectatorChat"]:checked').value;
        let newTablePassword = document.getElementById("newTablePassword").value;

        spectatorChat = spectatorChat === "true";
        spectatorsAllowed = spectatorsAllowed === "true";

        if (color === "random") {
            let rand = Math.random() < 0.5;
            if (rand)
                color = "black";
            else
                color = "white";
        }
        let turn;
        if (color === "white")
            turn = "player1";
        else
            turn = "player2";
        currentUserData.currentPlayerNumber = "player1";
        currentGameData = {
            "player1": {
                "name": currentUserData.name,
                "uid": currentUserData.user.uid,
                "authType": currentUserData.authType,
                "color": color,
                "joinType": "Host"
            },
            "spectatorsAllowed": spectatorsAllowed,
            "state": "Waiting for player two",
            "turn": turn,
            "running": false,
            "spectatorChat": spectatorChat
        };

        if (newTablePassword !== "")
            currentGameData.password = newTablePassword;

        let tempTableDatabaseReference = firebase.database().ref().child("runningGamesData");
        tempTableDatabaseReference.once("value").then((snapshot) => {
            for (let tableId = 0; true; tableId++) {
                let randomTableID = Math.round(Math.random() * 10000);
                if (!snapshot.child(randomTableID).exists()) {
                    tableDatabaseReference = tempTableDatabaseReference.child(randomTableID);
                    tableDatabaseReference.set(currentGameData);
                    document.getElementById("currentTableViewer").innerText = "Current Table ID : " + randomTableID;
                    createNewTableGrid();
                    setStartPositions();
                    renderTableGridPieces();
                    pushToDatabase();
                    addDatabaseActionListeners();
                    showSnackbarAlert("Table Created");
                    document.getElementById("inflatableDialog").style["display"] = "none";
                    break;
                }
            }

        });
    }

}

function joinTableOpen() {

    let tableId = document.getElementById("tableIdContainer").value;
    try {
        let tempTableDatabaseReference = firebase.database().ref().child("runningGamesData").child(tableId);
        tempTableDatabaseReference.once("value").then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.child("spectatorsAllowed").val());
                if (snapshot.child("spectatorsAllowed").val() === true) {
                    console.log("displaying dialog");
                    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
                    inflatableDialogContent.innerHTML = "";

                    let spectatorSelector = document.createElement("div");
                    spectatorSelector.innerHTML = "<h1>Join as :</h1>" +
                        "<div class='radioSelection'>" +
                        "<label class=\"checkMarkContainer\">Player\n" +
                        "<input type=\"radio\" name=\"joinAs\" value=\"player\" checked=\"checked\">\n" +
                        "<span class=\"checkMark\" ></span>\n" +
                        "</label>" +
                        "<label class=\"checkMarkContainer\">Spectator\n" +
                        "<input type=\"radio\" name=\"joinAs\" value=\"spectator\">\n" +
                        "<span class=\"checkMark\"></span>\n" +
                        "</label>\n" +
                        "</div>";

                    let submitButton = document.createElement("button");
                    submitButton.innerText = "Join Table";
                    submitButton.addEventListener("click", joinTable);

                    let cancelButton = document.createElement("button");
                    cancelButton.innerText = "Cancel";
                    cancelButton.addEventListener("click", () => {
                        document.getElementById("inflatableDialog").style["display"] = "none";
                    });

                    inflatableDialogContent.appendChild(spectatorSelector);
                    if (snapshot.child("password").exists()) {
                        let tablePassword = document.createElement("div");
                        tablePassword.innerHTML = "<h1>Table Password</h1>" +
                            "<input type='password' id='joinTablePassword' placeholder='Table Password'>";
                        inflatableDialogContent.appendChild(tablePassword);
                    }
                    inflatableDialogContent.appendChild(submitButton);
                    inflatableDialogContent.appendChild(cancelButton);

                    document.getElementById("inflatableDialog").style["display"] = "block";
                }
                else if (snapshot.child("password").exists()) {

                    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
                    inflatableDialogContent.innerHTML = "";
                    let tablePassword = document.createElement("div");
                    tablePassword.innerHTML = "<h1>Table Password</h1>" +
                        "<input type='password' id='joinTablePassword' placeholder='Table Password'>";
                    inflatableDialogContent.appendChild(tablePassword);

                    let submitButton = document.createElement("button");
                    submitButton.innerText = "Join Table";
                    submitButton.addEventListener("click", joinTable);

                    let cancelButton = document.createElement("button");
                    cancelButton.innerText = "Cancel";
                    cancelButton.addEventListener("click", () => {
                        document.getElementById("inflatableDialog").style["display"] = "none";
                    });

                    inflatableDialogContent.appendChild(submitButton);
                    inflatableDialogContent.appendChild(cancelButton);

                    document.getElementById("inflatableDialog").style["display"] = "block";
                }else {
                    console.log("joining as player");
                    joinTableAsPlayer();
                }
            } else{
                showSnackbarAlert("Table Not Found")
            }
        });
    }
    catch (e) {
        showSnackbarAlert("Invalid Table ID");
    }


}

function joinTableAsPlayer() {

    let tableId = document.getElementById("tableIdContainer").value;
    try {
        let tempTableDatabaseReference = firebase.database().ref().child("runningGamesData").child(tableId);
        tempTableDatabaseReference.once("value").then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.child("password").exists()){
                    let passwordContainer = document.getElementById("joinTablePassword");
                    if (snapshot.child("password").val() !== passwordContainer.value){
                        showSnackbarAlert("Invalid password");
                        return;
                    }
                }
                tableDatabaseReference = tempTableDatabaseReference;

                if (!snapshot.child("player1").exists() &&
                    (snapshot.child("player2").exists() && snapshot.child("player2").val()["uid"] !== currentUserData.user.uid)){
                    let color;
                    if (snapshot.val()["player2"]["color"] === "white")
                        color = "black";
                    else
                        color = "white";
                    currentGameData = {
                        "player1":{
                            "name" : currentUserData.name,
                            "uid" : currentUserData.user.uid,
                            "authType" : currentUserData.authType,
                            "color" : color,
                            "joinType" : "Player"
                        },
                        "state" : "Waiting to start"
                    };
                    tableDatabaseReference.child("player1").set(currentGameData.player1);
                    tableDatabaseReference.child("state").set(currentGameData.state);
                    currentUserData.currentPlayerNumber = "player1";
                }
                else if (snapshot.child("player1").exists() && snapshot.val()["player1"]["uid"] === currentUserData.user.uid){
                    currentUserData.currentPlayerNumber = "player1";
                }
                else if(!snapshot.child("player2").exists()){
                    let color;
                    if (snapshot.val()["player1"]["color"] === "white")
                        color = "black";
                    else
                        color = "white";
                    currentGameData = {
                        "player2":{
                            "name" : currentUserData.name,
                            "uid" : currentUserData.user.uid,
                            "authType" : currentUserData.authType,
                            "color" : color,
                            "joinType" : "Player"
                        },
                        "state" : "Waiting to start"
                    };
                    tableDatabaseReference.child("player2").set(currentGameData.player2);
                    tableDatabaseReference.child("state").set(currentGameData.state);
                    currentUserData.currentPlayerNumber = "player2";
                }
                else if(snapshot.child("player2").exists() && snapshot.val()["player2"]["uid"] === currentUserData.user.uid){
                    currentUserData.currentPlayerNumber = "player2";
                }else if (snapshot.child("player2").exists() && snapshot.child("player1").exists()){
                    showSnackbarAlert("No space available on table");
                    return;
                }else{
                    console.log("data anomaly occurred");
                }
                document.getElementById("currentTableViewer").innerText = "Current Table ID : " + snapshot.key;
                addDatabaseActionListeners();
                showSnackbarAlert("Table Joined");
            } else {
                showSnackbarAlert("Table Not Found")
            }
        });
    }
    catch (e) {
        showSnackbarAlert("Invalid Table ID");
    }
}

function joinTableAsSpectator() {
    let tableId = document.getElementById("tableIdContainer").value;
    try {
        let tempTableDatabaseReference = firebase.database().ref().child("runningGamesData").child(tableId);
        tempTableDatabaseReference.once("value").then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.child("password").exists()){
                    let passwordContainer = document.getElementById("joinTablePassword");
                    if (snapshot.child("password").val() !== passwordContainer.value){
                        showSnackbarAlert("Invalid password");
                        return;
                    }
                }
                tableDatabaseReference = tempTableDatabaseReference;
                let data = {
                    "name" : currentUserData.name,
                    "uid" : currentUserData.user.uid,
                    "authType" : currentUserData.authType,
                    "color" : "none",
                    "joinType" : "Spectator"
                };
                tableDatabaseReference.child("spectators").child(currentUserData.user.uid).set(data);
                currentUserData.currentPlayerNumber = "spectator";
                addDatabaseActionListeners();
                document.getElementById("currentTableViewer").innerText = "Current Table ID : " + snapshot.key
                    + "\nJoined as Spectator";
            }else {
                showSnackbarAlert("Table Not Found")
            }
        });
    }
    catch (e) {
        showSnackbarAlert("Invalid Table ID");
    }
}

function joinTable() {
    let joinAs = document.querySelector('input[name="joinAs"]:checked').value;
    if (joinAs === 'player'){
        joinTableAsPlayer();
    }else if(joinAs === 'spectator'){
        joinTableAsSpectator();
    }
    document.getElementById("inflatableDialog").style["display"] = "none";
}

function leaveTable(){
    if (currentGameData && !currentGameData.running && currentUserData.currentPlayerNumber !== "spectator"){
        if (currentUserData.currentPlayerNumber === "player1") {
            if (currentGameData.player2 && currentGameData.player1.joinType === "Host"){
                tableDatabaseReference.child("player2").child("joinType").set("Host");
                tableDatabaseReference.child("player1").set({});
                tableDatabaseReference.child("state").set("Waiting for player");
            }else if(currentGameData.player2){
                tableDatabaseReference.child("player1").set({});
                tableDatabaseReference.child("state").set("Waiting for player");
            }else{
                deleteTable();
            }
        } else if (currentUserData.currentPlayerNumber === "player2") {
            if (currentGameData.player1 && currentGameData.player2.joinType === "Host"){
                tableDatabaseReference.child("player1").child("joinType").set("Host");
                tableDatabaseReference.child("player2").set({});
                tableDatabaseReference.child("state").set("Waiting for player");
            }else if(currentGameData.player1){
                tableDatabaseReference.child("player2").set({});
                tableDatabaseReference.child("state").set("Waiting for player");
            }else{
                deleteTable();
            }
        }
        tableDatabaseReference.off();
        resetTable();
        document.getElementById("whitePlayerData").innerText = "Waiting for player";
        document.getElementById("blackPlayerData").innerText = "Waiting for player";
    }else if(currentGameData && currentUserData.currentPlayerNumber === "spectator"){
        tableDatabaseReference.child("spectators").child(currentUserData.user.uid).set({});
        tableDatabaseReference.off();
        document.getElementById("whitePlayerData").innerText = "Waiting for player";
        document.getElementById("blackPlayerData").innerText = "Waiting for player";
        resetTable();
    }else if (currentGameData && currentGameData.running){
        showSnackbarAlert("Cannot leave in the\n middle of the game")
    }

}

function deleteTable(){
    if (currentUserData.currentGamePermisstions !== "Host")
        return;

    if (currentGameData && !currentGameData.running)
        tableDatabaseReference.set({});
}