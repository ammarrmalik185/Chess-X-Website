function sendMessage() {

    if ((currentUserData.currentPlayerNumber === "spectator" && currentGameData.spectatorChat) ||
        currentUserData.currentPlayerNumber !== "spectator") {
        let textContainer = document.getElementById("newMessageField");

        if (textContainer.value.trim() !== "" && !textContainer.value.includes('\\') && !textContainer.value.includes('/')) {
            let d = new Date();
            let ss = d.getSeconds().toString().padStart(2, '0');
            let mm = d.getMinutes().toString().padStart(2, '0');
            let HH = d.getHours().toString().padStart(2, '0');
            let dd = d.getDate().toString().padStart(2, '0');
            let MM = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = d.getFullYear();
            let timeConstant = yyyy + MM + dd + HH + mm + ss;
            let identifier = "message_id_" + parseInt(timeConstant).toString();

            let messageData = {
                "sender": currentUserData.user.uid,
                "time": HH + ':' + mm + ":" + ss,
                date: dd + '/' + MM + '/' + yyyy,
                "text": textContainer.value,
                "senderName": currentUserData.name,
                "userType": currentUserData.currentPlayerNumber
            };
            tableDatabaseReference.child("messages").child(identifier).set(messageData);
            textContainer.value = "";
        } else {
            showSnackbarAlert("Invalid Message");
        }
    }else{
        showSnackbarAlert("Spectator chat not allowed");
    }
}

function renderMessages(){
    let messagesContainer = document.getElementById("conversationViewer");
    messagesContainer.innerText = "";
    for (let message in currentGameData["messages"]){
        if (currentGameData["messages"].hasOwnProperty(message))
            messagesContainer.appendChild(renderSingleMessage(currentGameData["messages"][message]));
    }
    messagesContainer.scrollTo(0,messagesContainer.scrollHeight);
}

function renderSingleMessage(messageValue) {

    let messageContainer = document.createElement("div");
    let playerNameContainer = document.createElement("h2");
    let textContainer = document.createElement("h3");
    let timeContainer = document.createElement("p");

    if(messageValue["userType"] === "spectator"){
        playerNameContainer.innerHTML = "<span>spectator</span>" + messageValue["senderName"];
    }else{
        playerNameContainer.innerText = messageValue["senderName"];
    }

    textContainer.innerText = messageValue["text"];
    timeContainer.innerText = messageValue["time"];

    messageContainer.appendChild(playerNameContainer);
    messageContainer.appendChild(textContainer);
    messageContainer.appendChild(timeContainer);

    if (messageValue["sender"] === currentUserData.user.uid){
        messageContainer.className = "sentMessage";
    }else{
        messageContainer.className = "receivedMessage";
    }

    return messageContainer;
}