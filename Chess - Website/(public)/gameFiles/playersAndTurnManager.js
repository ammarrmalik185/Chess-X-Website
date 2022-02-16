function checkForNewPlayers(snapshot) {

    if (currentGameData){
        if (!currentGameData.player1){
            if(snapshot.child("player1").exists()){
                showSnackbarAlert(snapshot.child("player1").child("name").val() + "\nhas joined as player")
            }
        }

        if (!currentGameData.player2){
            if(snapshot.child("player2").exists()){
                showSnackbarAlert(snapshot.child("player2").child("name").val() + "\nhas joined as player")
            }
        }

        if (currentGameData.player1){
            if(!snapshot.child("player1").exists()){
                showSnackbarAlert(currentGameData.player1.name + "\nhas left")
            }
        }

        if (currentGameData.player2){
            if(!snapshot.child("player2").exists()){
                showSnackbarAlert(currentGameData.player2.name + "\nhas left")
            }
        }

        if(snapshot.child("spectators").exists()){
            let spectators = snapshot.child("spectators").val();
            for (let spectator in spectators){
                if (!spectators.hasOwnProperty(spectator))
                    continue;

                if (currentGameData.spectators) {
                    if (!currentGameData.spectators.hasOwnProperty(spectator)){
                        showSnackbarAlert(spectators[spectator].name + "\nhas joined as spectator")
                    }
                }else{
                    showSnackbarAlert(spectators[spectator].name + "\nhas joined as spectator")
                }
            }
        }

        if(currentGameData && currentGameData.spectators){
            let spectators = snapshot.child("spectators");
            for (let spectator in currentGameData.spectators){
                if (!currentGameData.spectators.hasOwnProperty(spectator))
                    continue;
                if (spectators.exists()) {
                    if (!spectators.child(spectator).exists()){
                        showSnackbarAlert(currentGameData.spectators[spectator].name + "(spectator)\nhas left")
                    }
                }else{
                    showSnackbarAlert(currentGameData.spectators[spectator].name + "(spectator)\nhas left")
                }
            }
        }

    }
}

function changePermissionsToHost(){
    currentUserData.currentGamePermisstions = "Host";
    document.getElementById("deleteTableButton").style["display"] = "inline-block";
    document.getElementById("tableSettingsButton").style["display"] = "inline-block";
    document.getElementById("startGameButton").style["display"] = "inline-block";

}

function changePermissionsToNormal(){
    currentUserData.currentGamePermisstions = "Normal";
    document.getElementById("deleteTableButton").style["display"] = "none";
    document.getElementById("tableSettingsButton").style["display"] = "none";
    document.getElementById("startGameButton").style["display"] = "none";
}

function setupPlayerData() {

    let whitePlayerDataContainer = document.getElementById("whitePlayerData");
    let blackPlayerDataContainer = document.getElementById("blackPlayerData");

    if ((currentGameData.player1 && currentGameData.player1.color === "white") ||
        (currentGameData.player2 && currentGameData.player2.color === "black")){
        if (currentGameData.player1) {
            whitePlayerDataContainer.innerHTML = "";
            inflateUserView(currentGameData.player1, whitePlayerDataContainer);
        }
        if (currentGameData.player2) {
            blackPlayerDataContainer.innerHTML = "";
            inflateUserView(currentGameData.player2, blackPlayerDataContainer);
        }

    }else{
        if (currentGameData.player2) {
            whitePlayerDataContainer.innerHTML = "";
            inflateUserView(currentGameData.player2, whitePlayerDataContainer, "left");
        }
        if (currentGameData.player1) {
            blackPlayerDataContainer.innerHTML = "";
            inflateUserView(currentGameData.player1, blackPlayerDataContainer, "right");
        }
    }
}

function inflateUserView(userData, viewContainer){

    let profilePictureContainer = document.createElement("img");
    let informationContainer = document.createElement("div");

    let nameContainer = document.createElement("h3");
    let colorContainer = document.createElement("p");
    let roleContainer = document.createElement("p");
    let statsContainer = document.createElement("p");

    profilePictureContainer.src = "resources/default pp-01.svg";

    nameContainer.innerText = userData.name;
    informationContainer.appendChild(nameContainer);

    roleContainer.innerText = userData.joinType;
    informationContainer.appendChild(roleContainer);

    if (userData.joinType !== "Spectator"){
        colorContainer.innerText = "Color: " + userData.color;
        informationContainer.appendChild(colorContainer);
    }

    if (userData.authType === "verified"){
        firebase.database().ref().child("userData").child(userData.uid).once("value").then((snapshot) => {
            if (snapshot.exists()) {

                let userSnapData = snapshot.val();
                if ("profile picture" in userSnapData){
                    profilePictureContainer.src = userSnapData["profile picture"]
                }

                if (userData.joinType !== "Spectator") {
                    if ("gamesPlayed" in userSnapData && "gamesWon" in userSnapData) {
                        statsContainer.innerText = "Games Played : " + userSnapData["gamesPlayed"] +
                            ", Wins : " + userSnapData["gamesWon"] +
                            "\nWin rate : " + Math.round((userSnapData["gamesWon"]/userSnapData["gamesPlayed"]*100)*10)/10 + "%";
                    } else {
                        statsContainer.innerText = "No games played";
                    }
                }
            }else{
                console.log("user data anomaly occurred");
            }
        });

    }else{
        statsContainer.innerText = "Guest Account";
    }

    viewContainer.addEventListener("click",() => {
        let inflatableDialog = document.getElementById("inflatableDialog");
        let inflatableDialogContent = document.getElementById("inflatableDialogContent");
        let container = document.createElement("div");
        container.className = "playerDataContainer";

        inflatableDialogContent.innerText = "";
        inflatableDialogContent.appendChild(container);
        container.appendChild(profilePictureContainer.cloneNode(true));
        container.appendChild(nameContainer.cloneNode(true));
        container.appendChild(roleContainer.cloneNode(true));
        container.appendChild(statsContainer.cloneNode(true));

        let giveHostButton = document.createElement("button");
        giveHostButton.innerText = "Make Host";
        giveHostButton.addEventListener("click", ()=>{
            if (currentUserData.currentGamePermisstions === "Host" && currentGameData){
                if (currentUserData.currentPlayerNumber === "player1" && currentGameData.player2){
                    tableDatabaseReference.child("player1").child("joinType").set("Player");
                    tableDatabaseReference.child("player2").child("joinType").set("Host");
                    showSnackbarAlert("Host Changed");
                }else if (currentUserData.currentPlayerNumber === "player2"  && currentGameData.player1){
                    tableDatabaseReference.child("player2").child("joinType").set("Player");
                    tableDatabaseReference.child("player1").child("joinType").set("Host");
                    showSnackbarAlert("Host Changed");
                }else{
                    console.log("host change anomaly occurred")
                }

                inflatableDialog.style["display"] = "none";
                viewContainer.click();
            }
        });

        let kickButton = document.createElement("button");
        kickButton.innerText = "Kick Player";
        kickButton.className = "redButton";
        kickButton.addEventListener("click", ()=>{
            if (userData.joinType === "Spectator"){
                tableDatabaseReference.child("spectators").child(userData.uid).set({});
            }else{
                if (currentUserData.currentPlayerNumber === "player1"){
                    tableDatabaseReference.child("player2").set({});
                    inflatableDialog.style["display"] = "none";
                }else if(currentUserData.currentPlayerNumber === "player2"){
                    tableDatabaseReference.child("player1").set({});
                    inflatableDialog.style["display"] = "none";
                }else{
                    console.log("data anomaly occurred");
                }
            }
        });

        let closeDialogButton = document.createElement("button");
        closeDialogButton.innerText = "Close";
        closeDialogButton.className = "redButton";
        closeDialogButton.addEventListener("click", () => {
            inflatableDialog.style["display"] = "none";
        });

        if (currentUserData.currentGamePermisstions === "Host" && userData.uid !== currentUserData.user.uid) {
            if (userData.joinType !== "Spectator"){
                container.appendChild(giveHostButton);
            }
            container.appendChild(kickButton);
        }
        container.appendChild(closeDialogButton);

        inflatableDialog.style["display"] = "block";

    });

    viewContainer.appendChild(profilePictureContainer);
    viewContainer.appendChild(informationContainer);
}

function showSpectatorsDialog() {

    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";

    let cover = document.createElement("div");
    cover.className = "spectatorViewDialogCover";
    let header = document.createElement("h1");
    header.innerText = "Spectators";
    cover.appendChild(header);
    for (let spectator in currentGameData["spectators"]){
        if (currentGameData["spectators"].hasOwnProperty(spectator)) {
            let viewContainer = document.createElement("div");
            viewContainer.className = "spectatorListEntity";
            inflateUserView(currentGameData["spectators"][spectator], viewContainer);
            cover.appendChild(viewContainer);
        }
    }

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Back";
    cancelButton.addEventListener("click", ()=> {
        document.getElementById("inflatableDialog").style["display"] = "none";
    });

    cover.appendChild(cancelButton);
    inflatableDialogContent.appendChild(cover);
    document.getElementById("inflatableDialog").style["display"] = "block";
}

function setTurnValues() {
    document.getElementById("gameStatusContainer").innerText = currentGameData["state"];
    if (currentGameData[currentGameData.turn]) {
        document.getElementById("turnPlayerName").innerText = currentGameData[currentGameData.turn].name;
        document.getElementById("turnColor").innerText = currentGameData[currentGameData.turn].color;
    }
}

function openSettingsDialog(){
    if (currentUserData.currentGamePermisstions !== "Host")
        return;

    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";

    let settingsContainer = document.createElement("div");

    let spectatorSelector = document.createElement("div");
    spectatorSelector.innerHTML = "<h1>Allow Spectators</h1>" +
        "<div class='radioSelection'>" +
        "<label class=\"checkMarkContainer\">Yes\n" +
        "<input type=\"radio\" name=\"spectatorsChange\" value=true>\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">No\n" +
        "<input type=\"radio\" name=\"spectatorsChange\" value=false checked=\"checked\">\n" +
        "<span class=\"checkMark\" ></span>\n" +
        "</label>"+
        "</div>";

    let spectatorChat = document.createElement("div");
    spectatorChat.innerHTML = "<h1>Allow spectators to chat</h1>" +
        "<div class='radioSelection'>" +
        "<label class=\"checkMarkContainer\">Yes\n" +
        "<input type=\"radio\" name=\"spectatorChatChange\" value=true>\n" +
        "<span class=\"checkMark\"></span>\n" +
        "</label>\n" +
        "<label class=\"checkMarkContainer\">No\n" +
        "<input type=\"radio\" name=\"spectatorChatChange\" value=false checked=\"checked\">\n" +
        "<span class=\"checkMark\" ></span>\n" +
        "</label>"+
        "</div>";


    let tablePassword = document.createElement("div");
    tablePassword.innerHTML = "<h1>Table Password</h1>" +
        "<input type='password' id='changeTablePassword' placeholder='Table Password(leave blank for no password)'>";

    let submitButton = document.createElement("button");
    submitButton.innerText = "Change Settings";
    submitButton.addEventListener("click", changeSettings);

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", ()=> {
        document.getElementById("inflatableDialog").style["display"] = "none";
    });

    settingsContainer.appendChild(spectatorSelector);
    settingsContainer.appendChild(spectatorChat);
    settingsContainer.appendChild(tablePassword);
    settingsContainer.appendChild(submitButton);
    settingsContainer.appendChild(cancelButton);
    inflatableDialogContent.appendChild(settingsContainer);

    document.getElementsByName("spectatorChatChange").forEach((element)=>{
        element.checked = element.value === currentGameData.spectatorChat.toString();
    });
    document.getElementsByName("spectatorsChange").forEach((element)=>{
        element.checked = element.value === currentGameData.spectatorsAllowed.toString();
    });
    if (currentGameData.password)
        document.getElementById("changeTablePassword").value = currentGameData.password;
    else
        document.getElementById("changeTablePassword").value = "";

    document.getElementById("inflatableDialog").style["display"] = "block";
}

function changeSettings(){
    let spectatorsAllowed = document.querySelector('input[name="spectatorsChange"]:checked').value;
    let spectatorChat = document.querySelector('input[name="spectatorChatChange"]:checked').value;
    let changeTablePassword = document.getElementById("changeTablePassword").value;

    tableDatabaseReference.child("spectatorsAllowed").set(spectatorsAllowed === "true");
    tableDatabaseReference.child("spectatorChat").set(spectatorChat === "true");

    if (changeTablePassword !== ""){
        tableDatabaseReference.child("password").set(changeTablePassword);
    }else{
        tableDatabaseReference.child("password").set({});
    }

    document.getElementById("inflatableDialog").style["display"] = "none";
    showSnackbarAlert("Setting Changed");
}