let currentUserData;

function setup(){
    currentUserData = {};
    let firebaseConfig = {
        apiKey: "AIzaSyB0tx9ErJJG5gjXa_Fdkppbw7v6EYm88so",
        authDomain: "chess-x.firebaseapp.com",
        databaseURL: "https://chess-x.firebaseio.com",
        projectId: "chess-x",
        storageBucket: "chess-x.appspot.com",
        messagingSenderId: "532454828929",
        appId: "1:532454828929:web:72315ff9afe39f6f365680"
    };
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged(function(user) {
        currentUserData.user = user;
        if (user) {
            firebase.database().ref().child("userData").child(currentUserData.user.uid).on('value', (snapshot) => {
                let profilePicture = document.getElementById("userDisplayProfilePicture");
                let userName = document.getElementById("userDisplayName");
                let statsContainer = document.getElementById("currentUserStats");

                if (snapshot.exists()){
                    currentUserData.authType = "verified";
                    let userSnapData = snapshot.val();
                    currentUserData.name = userSnapData["name"];
                    userName.innerText = userSnapData["name"];

                    if ("profile picture" in userSnapData){
                        profilePicture.src = userSnapData["profile picture"]
                    }
                    else{
                        profilePicture.src = "resources/default%20pp-01.svg";
                    }
                    if ("gamesPlayed" in userSnapData && "gamesWon" in userSnapData){
                        currentUserData.gamesPlayed = userSnapData["gamesPlayed"];
                        currentUserData.gamesWon = userSnapData["gamesWon"];
                        statsContainer.innerText = "Games Played : " + userSnapData["gamesPlayed"] +
                        ", Wins : " + userSnapData["gamesWon"] +
                            "\nWin rate : " + Math.round((userSnapData["gamesWon"]/userSnapData["gamesPlayed"]*100)*10)/10 + "%";
                    }else {
                        statsContainer.innerText = "No games played";
                    }w

                }else{
                    if (currentUserData.user.isAnonymous){
                        if (currentUserData.name === undefined) {
                            currentUserData.name = currentUserData.user.displayName;
                            userName.innerText = currentUserData.name;
                            currentUserData.authType = "guest";
                            statsContainer.innerText = "Logged in as guest";
                        } else {
                            currentUserData.user.updateProfile({
                                displayName: currentUserData.name,
                            });
                            userName.innerText = currentUserData.name;
                            currentUserData.authType = "guest";
                        }
                    }else{
                        let nameField = document.getElementById("nameField");
                        firebase.database().ref().child("userData").child(currentUserData.user.uid).child("name").set(nameField.value);
                        currentUserData.authType = "verified";
                        currentUserData.name = nameField.value;
                        userName.innerText = nameField.value;
                    }
                    profilePicture.src = "resources/default%20pp-01.svg";
                }
            });
            closeLoginDialog();
            signUpDialogClose();
            closePlayAsGuestDialog();
        }
        else{
            currentUserData = {};
            openLoginDialog();
        }
    });
}

function login(){
    firebase.auth().signInWithEmailAndPassword(
        document.getElementById("emailField").value,
        document.getElementById("passwordField").value)
        .then(function () {
            showSnackbarAlert("Logged in");
        })
        .catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                showSnackbarAlert('Wrong password.');
            } else {
                showSnackbarAlert(errorMessage);
            }
        });
}

function logOut() {
    firebase.auth().signOut().then(function () {
        showSnackbarAlert("Logged out");
    });
    userDataDialogClose();
}

function openLoginDialog(){
    let dialog = document.getElementById("dialog");
    dialog.style["display"] = "block";
}

function closeLoginDialog(){
    let dialog = document.getElementById("dialog");
    dialog.style["display"] = "none";
}

function signUpDialogOpen() {
    let dialog = document.getElementById("signUpDialog");
    dialog.style["display"] = "block";
}

function signUpDialogClose() {
    let dialog = document.getElementById("signUpDialog");
    dialog.style["display"] = "none";
}

function signUp() {
    let emailField = document.getElementById("emailFieldNewUser");
    let passWordField1 = document.getElementById("passwordField1NewUser");
    let passWordField2 = document.getElementById("passwordField2NewUser");
    let nameField = document.getElementById("nameField");
    if (nameField.value.trim() !== "") {
        if (passWordField1.value === passWordField2.value) {
            firebase.auth().createUserWithEmailAndPassword(emailField.value, passWordField1.value).catch(function (error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                showSnackbarAlert(errorMessage);
                console.log(errorCode);
            });
        }
    }else {
        showSnackbarAlert("Name is required")
    }


}

function showPlayAsGuestDialog() {
    let dialogContent = document.getElementById("inflatableDialogContent");
    dialogContent.innerHTML ="" +
        "<div id='playAsGuestContainer'>" +
            "<label for = \"tempNameContainer\">Name: </label>" +
            "<input type='text' id='tempNameContainer'>" +
            "<button onclick='playAsGuest()'>Confirm</button>" +
            "<button onclick='closePlayAsGuestDialog()'>Cancel</button>" +
        "</div>";
    document.getElementById("inflatableDialog").style["display"] = "block";
}

function closePlayAsGuestDialog() {
    document.getElementById("inflatableDialog").style["display"] = "none";
}

function playAsGuest() {
    currentUserData.name = document.getElementById("tempNameContainer").value;
    firebase.auth().signInAnonymously().catch(function(error) {
        // let errorCode = error.code;
        let errorMessage = error.message;
        showSnackbarAlert(errorMessage);
    });
}

function userDataDialogOpen() {
    if (currentUserData.user) {
        firebase.database().ref().child("userData").child(currentUserData.user.uid).once('value').then((snapshot) => {
            let dialog = document.getElementById("profileViewDialog");
            let profilePictureNode = document.getElementById("profileViewPicture");
            let nameNode = document.getElementById("profileViewName");
            if (snapshot.exists()){
                let userSnapData = snapshot.val();
                nameNode.innerText = userSnapData["name"];
                if ("profile picture" in userSnapData){
                    profilePictureNode.src = userSnapData["profile picture"]
                }
                else{
                    profilePictureNode.src = "resources/default%20pp-01.svg";
                }
                document.getElementById("changePasswordButton").style["display"] = "inline-block";
            }
            else if (currentUserData.user.isAnonymous){
                nameNode.innerText = currentUserData.name;
                profilePictureNode.src = "resources/default%20pp-01.svg";
            }else{
                console.log("data anomaly occurred");
            }
            dialog.style["display"] = "block";
        });
    }


}

function userDataDialogClose() {
    let dialog = document.getElementById("profileViewDialog");
    dialog.style["display"] = "none";
}

function changeDataDialogOpen(){

    if (currentUserData.user) {

        firebase.database().ref().child("userData").child(currentUserData.user.uid).once('value').then((snapshot) => {
            let dialog = document.getElementById("editDataDialog");
            let nameNode = document.getElementById("nameFieldEdit");
            if (snapshot.exists()) {
                let userSnapData = snapshot.val();
                nameNode.placeholder = userSnapData["name"];
            }else if (currentUserData.user.isAnonymous){
                nameNode.placeholder = currentUserData.name;
            }else {
                nameNode.placeholder = "Not available";
            }
            dialog.style["display"] = "block";
        });
    }
}

function changeDataDialogClose() {
    let dialog = document.getElementById("editDataDialog");
    dialog.style["display"] = "none";
}

function editUserData(){
    if (currentUserData.user){
        let dialog = document.getElementById("editDataDialog");
        let nameNode = document.getElementById("nameFieldEdit");
        if (currentUserData.authType === "guest"){
            currentUserData.name = nameNode.value;
            currentUserData.user.updateProfile({
                displayName: currentUserData.name,
            });
            document.getElementById("userDisplayName").innerText = currentUserData.name;
        }else {
            let userDataRef = firebase.database().ref().child("userData").child(currentUserData.user.uid);
            userDataRef.once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    if (nameNode.value !== "") {
                        userDataRef.child("name").set(nameNode.value)
                    }
                    userDataDialogClose();
                    dialog.style["display"] = "none";
                    userDataDialogOpen();
                } else {
                    if (nameNode.value !== "") {
                        let data = {
                            "name": nameNode.value,
                        };
                        userDataRef.set(data);
                        userDataDialogClose();
                        dialog.style["display"] = "none";
                        userDataDialogOpen();
                    } else {
                        showSnackbarAlert("Since this is your first time adding data, Name is required");
                    }
                }
            });
        }

    }
    changeDataDialogClose();
    userDataDialogClose();
    userDataDialogOpen();
}

function changePasswordDialogOpen() {
    if(currentUserData.authType === "guest"){
        showSnackbarAlert("Guest accounts cannot change \n password");
        return;
    }
    let dialog = document.getElementById("changePasswordDialog");
    dialog.style["display"] = "block";
}

function changePasswordDialogClose() {
    let dialog = document.getElementById("changePasswordDialog");
    dialog.style["display"] = "none";
}

function changePassword() {
    if (currentUserData.user){

        let oldPassField = document.getElementById("oldPasswordField");
        let newPassField1 = document.getElementById("newPasswordField1");
        let newPassField2 = document.getElementById("newPasswordField2");
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUserData.user.email,
            oldPassField.value
        );
        currentUserData.user.reauthenticateWithCredential(credential).then(function() {
            if (newPassField1.value === newPassField2.value && newPassField1.value.length >= 6) {
                currentUserData.user.updatePassword(newPassField1.value).then(function () {
                    showSnackbarAlert("Password Updated");
                    changePasswordDialogClose();
                }).catch(function (error) {
                    console.log(error);
                    showSnackbarAlert("Failed to update Password");
                });
            }
        }).catch(function(error) {
            console.log(error);
            showSnackbarAlert("Authentication Failed, check password and try again");
        });

    }
}

function cancelChangeProfilePicture(){
    newProfilePicture = undefined;
    let changeConfirmationDialog = document.getElementById("profilePictureChangeConfirmation");
    changeConfirmationDialog.style["display"] = "none";
    userDataDialogClose();
    userDataDialogOpen();
}

function confirmChangeProfilePicture() {

    let dialog = document.getElementById("progressBarDialog");
    let progressBar = document.getElementById("progressBar");
    let progressValue = document.getElementById("progressValue");

    let fileUploadPath = firebase.storage().ref().child("user profile images").child(
        currentUserData.user.uid + "." + newProfilePicture.name.split('.').pop()
    );

    let fileUploadTask = fileUploadPath.put(newProfilePicture);
    dialog.style["display"] = "block";
    fileUploadTask.on('state_changed', function(snapshot){
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        let progressStyleString = progress.toString() + "%";
        progressBar.style["width"] = progressStyleString;
        progressValue.innerText = progressStyleString;
    }, function(error) {
        console.log(error);
        showSnackbarAlert(error);
        dialog.style["display"] = "none";
    }, function() {
        fileUploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            dialog.style["display"] = "none";
            firebase.database().ref().child("userData").child(currentUserData.user.uid).child("profile picture").set(downloadURL);
            showSnackbarAlert("Profile Picture Changed");
            cancelChangeProfilePicture();
        });
    });
}

function changeProfilePicture() {
    let dudInput = document.createElement("input");
    dudInput.type = "file";
    dudInput.accept = "image/*";
    dudInput.click();
    dudInput.addEventListener("change", imageSelected);
    function imageSelected(fileFakePath) {
        let profilePicture = document.getElementById("profileViewPicture");
        let file = fileFakePath.target.files[0];
        console.log(file);
        newProfilePicture = file;
        profilePicture.src = URL.createObjectURL(file);
        profilePicture.onload = function() {
            URL.revokeObjectURL(profilePicture.src)
        };
        let changeConfirmationDialog = document.getElementById("profilePictureChangeConfirmation");
        changeConfirmationDialog.style["display"] = "block"
    }
}

setup();
