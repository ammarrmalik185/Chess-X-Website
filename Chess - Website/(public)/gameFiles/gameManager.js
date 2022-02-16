function calculatePossibleMoves(cord_y, cord_x){

    let localCellData = tableGridData[cord_y][cord_x];

    if (localCellData.containsPiece){
        switch (localCellData.containsPiece) {
            case "pawn":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesPawn(cord_y, cord_x));

            case "bishop":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesBishop(cord_y, cord_x));

            case "rook":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesRook(cord_y, cord_x));

            case "knight":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesKnight(cord_y, cord_x));

            case "queen":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesQueen(cord_y, cord_x));

            case "king":
                return moveAndTestCheck(cord_y, cord_x, calculatePossibleMovesKing(cord_y, cord_x));
        }
    }
}

function calculatePossibleMovesChecked(cord_y, cord_x) {
    let localCellData = tableGridData[cord_y][cord_x];

    if (localCellData.containsPiece){
        switch (localCellData.containsPiece) {
            case "pawn":
                return calculatePossibleMovesPawnChecked(cord_y, cord_x);

            case "bishop":
                return calculatePossibleMovesBishopChecked(cord_y, cord_x);

            case "rook":
                return calculatePossibleMovesRookChecked(cord_y, cord_x);

            case "knight":
                return calculatePossibleMovesKnightChecked(cord_y, cord_x);

            case "queen":
                return calculatePossibleMovesQueen(cord_y, cord_x);

            case "king":
                return calculatePossibleMovesKingChecked(cord_y, cord_x);
        }
    }
}

function calculatePossibleMovesPawn(cord_y, cord_x) {

    let possibleMoves = [];
    let possibleKills = [];
    let promotionMoves = [];
    let projected_x ;
    let projected_y ;

    if (tableGridData[cord_y][cord_x].pieceColor === "white"){
        projected_x = cord_x;
        projected_y = cord_y + 1;
        if (projected_y < 8 && !tableGridData[projected_y][projected_x].containsPiece){
            possibleMoves.push(projected_y + "," + projected_x);
            if (cord_y === 1){
                projected_y ++;
                if (projected_y < 8 && !tableGridData[projected_y][projected_x].containsPiece) {
                    possibleMoves.push(projected_y + "," + projected_x);
                }
            }
        }

        projected_y = cord_y + 1;
        if (projected_y < 8 &&
            projected_x + 1 < 8 &&
            tableGridData[projected_y][projected_x + 1].pieceColor === "black"
        ){
            possibleKills.push(projected_y + "," + (projected_x+1));
        }
        if (projected_y < 8 &&
            projected_x - 1 >= 0 &&
            tableGridData[projected_y][projected_x - 1].pieceColor === "black"
        ){
            possibleKills.push(projected_y + "," + (projected_x-1));
        }

        for (let move of possibleMoves){
            if(move.includes("7,")){
                promotionMoves.push(move);
            }
        }

    }else{
        projected_x = cord_x;
        projected_y = cord_y - 1;
        if (projected_y >= 0 && !tableGridData[projected_y][projected_x].containsPiece){
            possibleMoves.push(projected_y + "," + projected_x);
            if (cord_y === 6){
                projected_y --;
                if (projected_y >= 0 &&!tableGridData[projected_y][projected_x].containsPiece) {
                    possibleMoves.push(projected_y + "," + projected_x);
                }
            }
        }
        projected_y = cord_y - 1;
        if (projected_y >= 0 &&
            projected_x+1 < 8 &&
            tableGridData[projected_y][projected_x+1].pieceColor === "white"
        ){
            possibleKills.push(projected_y + "," + (projected_x + 1));
        }
        if (projected_y >= 0 &&
            projected_x-1 >= 0 &&
            tableGridData[projected_y][projected_x - 1].pieceColor === "white"
        ){
            possibleKills.push(projected_y + "," + (projected_x-1));
        }
        for (let move of possibleMoves){
            if(move.includes("0,")){
                promotionMoves.push(move);
            }
        }
    }
    return [possibleMoves, possibleKills, promotionMoves, []];
}

function calculatePossibleMovesRook(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x = cord_x +1;
    let projected_y = cord_y;
    while (projected_x < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x ++;
        }
    }
    projected_x = cord_x;
    projected_y = cord_y + 1;
    while (projected_y < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y ++;
        }
    }
    projected_x = cord_x -1;
    projected_y = cord_y;
    while (projected_x >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x --;
        }
    }
    projected_x = cord_x;
    projected_y = cord_y -1;
    while (projected_y >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y --;
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesBishop(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x = cord_x +1;
    let projected_y = cord_y + 1;
    while (projected_x < 8 && projected_y < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x ++;
            projected_y ++;
        }
    }
    projected_x = cord_x - 1;
    projected_y = cord_y + 1;
    while (projected_y < 8 && projected_x >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y ++;
            projected_x --;
        }
    }
    projected_x = cord_x -1;
    projected_y = cord_y -1;
    while (projected_x >= 0 && projected_y >=0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x --;
            projected_y --;
        }
    }
    projected_x = cord_x +1;
    projected_y = cord_y -1;
    while (projected_y >= 0 && projected_x<8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            if (projectedCellData.pieceColor !== tableGridData[cord_y][cord_x].pieceColor)
                possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y --;
            projected_x ++;
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesKnight(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];

    let projectedMoves = [
        ((cord_y-2) + "," + (cord_x-1)),
        ((cord_y-2) + "," + (cord_x+1)),
        ((cord_y+2) + "," + (cord_x-1)),
        ((cord_y+2) + "," + (cord_x+1)),
        ((cord_y-1) + "," + (cord_x-2)),
        ((cord_y+1) + "," + (cord_x-2)),
        ((cord_y-1) + "," + (cord_x+2)),
        ((cord_y+1) + "," + (cord_x+2)),
    ];
    let projected_x;
    let projected_y;
    for (let move of projectedMoves) {
        projected_x = parseInt(move[2]);
        projected_y = parseInt(move[0]);
        if (projected_x < 8 && projected_x >= 0 && projected_y < 8 && projected_y >= 0){
            if (tableGridData[projected_y][projected_x].containsPiece){
                if (tableGridData[projected_y][projected_x].pieceColor !== tableGridData[cord_y][cord_x].pieceColor){
                    possibleKills.push(move);
                }
            }else{
                possibleMoves.push(move);
            }
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesQueen(cord_y, cord_x) {

    let rookMoves = calculatePossibleMovesRook(cord_y, cord_x);
    let bishopMoves = calculatePossibleMovesBishop(cord_y, cord_x);

    for (let i of bishopMoves[0]){
        rookMoves[0].push(i);
    }
    for (let i of bishopMoves[1]){
        rookMoves[1].push(i);
    }

    return rookMoves;
}

function calculatePossibleMovesKing(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x ;
    let projected_y ;

    let reverseColor;

    if(tableGridData[cord_y][cord_x].pieceColor === "white")
        reverseColor = "black";
    else
        reverseColor = "white";

    let checkedBoxes = getCombinedMoves(reverseColor);

    for (projected_y = cord_y-1; projected_y <= cord_y+1; projected_y ++) {
        for (projected_x = cord_x - 1; projected_x <= cord_x + 1; projected_x++) {
            if (projected_x < 8 && projected_x >= 0 && projected_y < 8 && projected_y >= 0) {
                if (tableGridData[projected_y][projected_x].containsPiece) {
                    if (tableGridData[projected_y][projected_x].pieceColor !== tableGridData[cord_y][cord_x].pieceColor) {
                        let killBox = projected_y + "," + projected_x;
                        if(!checkedBoxes[0].includes(killBox) && !checkedBoxes[1].includes(killBox))
                            possibleKills.push(killBox);
                    }
                } else {
                    let moveBox = projected_y + "," + projected_x;
                    if(!checkedBoxes[0].includes(moveBox) && !checkedBoxes[1].includes(moveBox))
                        possibleMoves.push(moveBox);
                }
            }
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesKingChecked(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x ;
    let projected_y ;

    for (projected_y = cord_y-1; projected_y <= cord_y+1; projected_y ++) {
        for (projected_x = cord_x - 1; projected_x <= cord_x + 1; projected_x++) {
            if (projected_x < 8 && projected_x >= 0 && projected_y < 8 && projected_y >= 0) {
                if (tableGridData[projected_y][projected_x].containsPiece) {
                    if (tableGridData[projected_y][projected_x].pieceColor !== tableGridData[cord_y][cord_x].pieceColor) {
                        let killBox = projected_y + "," + projected_x;
                        possibleKills.push(killBox);
                    }
                } else {
                    let moveBox = projected_y + "," + projected_x;
                    possibleMoves.push(moveBox);
                }
            }
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesPawnChecked(cord_y, cord_x) {

    let possibleMoves = [];
    let possibleKills = [];
    let projected_x ;
    let projected_y ;

    if (tableGridData[cord_y][cord_x].pieceColor === "white"){
        projected_x = cord_x;
        projected_y = cord_y + 1;

        if (projected_y < 8 &&
            projected_x + 1 < 8){
            possibleKills.push(projected_y + "," + (projected_x+1));
        }
        if (projected_y < 8 &&
            projected_x - 1 >= 0){
            possibleKills.push(projected_y + "," + (projected_x-1));
        }

    }else{
        projected_x = cord_x;
        projected_y = cord_y - 1;

        if (projected_y >= 0 &&
            projected_x+1 < 8){
            possibleKills.push(projected_y + "," + (projected_x + 1));
        }
        if (projected_y >= 0 &&
            projected_x-1 >= 0){
            possibleKills.push(projected_y + "," + (projected_x-1));
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesRookChecked(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x = cord_x +1;
    let projected_y = cord_y;
    while (projected_x < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x ++;
        }
    }
    projected_x = cord_x;
    projected_y = cord_y + 1;
    while (projected_y < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y ++;
        }
    }
    projected_x = cord_x -1;
    projected_y = cord_y;
    while (projected_x >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x --;
        }
    }
    projected_x = cord_x;
    projected_y = cord_y -1;
    while (projected_y >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y --;
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesBishopChecked(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];
    let projected_x = cord_x +1;
    let projected_y = cord_y + 1;
    while (projected_x < 8 && projected_y < 8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x ++;
            projected_y ++;
        }
    }
    projected_x = cord_x - 1;
    projected_y = cord_y + 1;
    while (projected_y < 8 && projected_x >= 0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y ++;
            projected_x --;
        }
    }
    projected_x = cord_x -1;
    projected_y = cord_y -1;
    while (projected_x >= 0 && projected_y >=0){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_x --;
            projected_y --;
        }
    }
    projected_x = cord_x +1;
    projected_y = cord_y -1;
    while (projected_y >= 0 && projected_x<8){
        let projectedCellData = tableGridData[projected_y][projected_x];
        if (projectedCellData.containsPiece){
            possibleKills.push(projected_y + "," + projected_x);
            break;
        } else{
            possibleMoves.push(projected_y + "," + projected_x);
            projected_y --;
            projected_x ++;
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function calculatePossibleMovesKnightChecked(cord_y, cord_x) {
    let possibleMoves = [];
    let possibleKills = [];

    let projectedMoves = [
        ((cord_y-2) + "," + (cord_x-1)),
        ((cord_y-2) + "," + (cord_x+1)),
        ((cord_y+2) + "," + (cord_x-1)),
        ((cord_y+2) + "," + (cord_x+1)),
        ((cord_y-1) + "," + (cord_x-2)),
        ((cord_y+1) + "," + (cord_x-2)),
        ((cord_y-1) + "," + (cord_x+2)),
        ((cord_y+1) + "," + (cord_x+2)),
    ];
    let projected_x;
    let projected_y;
    for (let move of projectedMoves) {
        projected_x = parseInt(move[2]);
        projected_y = parseInt(move[0]);
        if (projected_x < 8 && projected_x >= 0 && projected_y < 8 && projected_y >= 0){
            if (tableGridData[projected_y][projected_x].containsPiece){
                    possibleKills.push(move);
            }else{
                possibleMoves.push(move);
            }
        }
    }
    return [possibleMoves, possibleKills, [], []];
}

function tagTableGrid(possibleMoves, possibleKills, promotionMoves, castlingMoves) {
    let prev_possibleMoves = document.getElementsByClassName("possibleMoveSquare");
    while(prev_possibleMoves.length > 0){
        prev_possibleMoves[0].classList.remove("possibleMoveSquare");
    }

    let prev_possibleKills = document.getElementsByClassName("possibleKillSquare");
    while(prev_possibleKills.length > 0){
        prev_possibleKills[0].classList.remove("possibleKillSquare");
    }

    let prev_promotionMoves = document.getElementsByClassName("promotionSquare");
    while(prev_promotionMoves.length > 0){
        prev_promotionMoves[0].classList.remove("promotionSquare");
    }

    let prev_castlingMoves = document.getElementsByClassName("castlingMoveSquare");
    while(prev_castlingMoves.length > 0){
        prev_castlingMoves[0].classList.remove("castlingMoveSquare");
    }

    for (let move of possibleMoves){
        document.getElementById(move).classList.add("possibleMoveSquare");
    }
    for (let kill of possibleKills){
        document.getElementById(kill).classList.add("possibleKillSquare");
    }
    for (let pMove of promotionMoves){
        document.getElementById(pMove).classList.add("promotionSquare");
    }
    for (let cMove of castlingMoves){
        document.getElementById(cMove).classList.add("castlingMoveSquare");
    }

}

function getCombinedMoves(color){

    let combinedMoves = [[],[], [], []];
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (tableGridData[y][x].pieceColor === color){
                let currentPieceMoves;
                currentPieceMoves = calculatePossibleMovesChecked(y, x);

                for (let i of currentPieceMoves[0]){
                    if (!combinedMoves[0].includes(i))
                        combinedMoves[0].push(i);
                }
                for (let i of currentPieceMoves[1]){
                    if (!combinedMoves[1].includes(i))
                        combinedMoves[1].push(i);
                }
                for (let i of currentPieceMoves[2]){
                    if (!combinedMoves[2].includes(i))
                        combinedMoves[2].push(i);
                }
            }
        }
    }
    return combinedMoves;
}

function detectCheck(kingCoords_y, kingCoords_x, color){

    let reverseColor;
    if(color === "white")
        reverseColor = "black";
    else
        reverseColor = "white";

    let combinedMoves = getCombinedMoves(reverseColor);
    return combinedMoves[1].includes(kingCoords_y + "," + kingCoords_x) || combinedMoves[2].includes(kingCoords_y + "," + kingCoords_x) ;
}

function detectCheckMate(color) {

    let kingCoords_x;
    let kingCoords_y;
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if(tableGridData[y][x].containsPiece && tableGridData[y][x].containsPiece === "king"
                && tableGridData[y][x].pieceColor === color){
                kingCoords_y  = y;
                kingCoords_x = x;
                break;
            }
        }
    }

    if(detectCheck(kingCoords_y, kingCoords_x, color)){
        let moves = calculatePossibleMoves(kingCoords_y, kingCoords_x);
        if(moves[0].length === 0 && moves[1].length === 0 ){
            showSnackbarAlert("CheckMate");
            return true;
        }else{
            showSnackbarAlert("Checked");
        }
    }else{
        if(onlyKingLeft(color)){
            let moves = calculatePossibleMoves(kingCoords_y, kingCoords_x);
            if(moves[0].length === 0 && moves[1].length === 0 ){
                showSnackbarAlert("CheckMate");
                return true;
            }else{
                showSnackbarAlert("Checked");
            }
        }
    }

    return false;
}

function onlyKingLeft(color){
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if(tableGridData[y][x].pieceColor === color && tableGridData[y][x].containsPiece !== "king")
                return false;
        }
    }
    return true;
}

function moveAndTestCheck(pieceCoords_y, pieceCoords_x, filterMoves){
    console.log(filterMoves);
    let validMoves = [[],[], [], []];

    let pieceBoxResource = tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource;
    let pieceBoxColor = tableGridData[pieceCoords_y][pieceCoords_x].pieceColor;
    let pieceBoxPiece = tableGridData[pieceCoords_y][pieceCoords_x].containsPiece;

    for (let move in filterMoves[0]) {

        if(!filterMoves[0].hasOwnProperty(move))
            continue;

        let projected_y = parseInt(filterMoves[0][move][0]);
        let projected_x = parseInt(filterMoves[0][move][2]);

        tableGridData[projected_y][projected_x].containsPieceResource = pieceBoxResource;
        tableGridData[projected_y][projected_x].pieceColor = pieceBoxColor;
        tableGridData[projected_y][projected_x].containsPiece = pieceBoxPiece;

        tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource  = null;
        tableGridData[pieceCoords_y][pieceCoords_x].pieceColor  = null;
        tableGridData[pieceCoords_y][pieceCoords_x].containsPiece  = null;

        let kingCoords_x;
        let kingCoords_y;
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                if(tableGridData[y][x].containsPiece && tableGridData[y][x].containsPiece === "king"
                    && tableGridData[y][x].pieceColor === pieceBoxColor){
                    kingCoords_y  = y;
                    kingCoords_x = x;
                    break;
                }
            }
        }
        if(!detectCheck(kingCoords_y, kingCoords_x, pieceBoxColor)){
            validMoves[0].push(projected_y + "," + projected_x);
            if (filterMoves[2].hasOwnProperty(move)){
                validMoves[2].push(projected_y + "," + projected_x);
            }
        }

        tableGridData[projected_y][projected_x].containsPieceResource = null;
        tableGridData[projected_y][projected_x].pieceColor = null;
        tableGridData[projected_y][projected_x].containsPiece  = null;

        tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource = pieceBoxResource;
        tableGridData[pieceCoords_y][pieceCoords_x].pieceColor = pieceBoxColor;
        tableGridData[pieceCoords_y][pieceCoords_x].containsPiece = pieceBoxPiece;

    }
    for (let kill in filterMoves[1]) {

        if(!filterMoves[1].hasOwnProperty(kill))
            continue;

        let projected_y = parseInt(filterMoves[1][kill][0]);
        let projected_x = parseInt(filterMoves[1][kill][2]);

        let newBoxResource = tableGridData[projected_y][projected_x].containsPieceResource;
        let newBoxColor  = tableGridData[projected_y][projected_x].pieceColor;
        let newBoxPiece  = tableGridData[projected_y][projected_x].containsPiece;

        tableGridData[projected_y][projected_x].containsPieceResource = tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource;
        tableGridData[projected_y][projected_x].pieceColor = tableGridData[pieceCoords_y][pieceCoords_x].pieceColor;
        tableGridData[projected_y][projected_x].containsPiece = tableGridData[pieceCoords_y][pieceCoords_x].containsPiece;

        tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource = null;
        tableGridData[pieceCoords_y][pieceCoords_x].pieceColor = null;
        tableGridData[pieceCoords_y][pieceCoords_x].containsPiece = null;

        let kingCoords_x;
        let kingCoords_y;
        for (let y = 0; y < 8; y++){
            for (let x = 0; x < 8; x++){
                if(tableGridData[y][x].containsPiece && tableGridData[y][x].containsPiece === "king"
                    && tableGridData[y][x].pieceColor === pieceBoxColor){
                    kingCoords_y  = y;
                    kingCoords_x = x;
                    break;
                }
            }
        }
        if(!detectCheck(kingCoords_y, kingCoords_x, pieceBoxColor)){
            validMoves[1].push(projected_y + "," + projected_x);
        }

        tableGridData[projected_y][projected_x].containsPieceResource = newBoxResource;
        tableGridData[projected_y][projected_x].pieceColor = newBoxColor;
        tableGridData[projected_y][projected_x].containsPiece = newBoxPiece;

        tableGridData[pieceCoords_y][pieceCoords_x].containsPieceResource = pieceBoxResource;
        tableGridData[pieceCoords_y][pieceCoords_x].pieceColor = pieceBoxColor;
        tableGridData[pieceCoords_y][pieceCoords_x].containsPiece = pieceBoxPiece;

    }
    console.log(validMoves);
    return validMoves;

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (currentGameData.running && currentUserData.currentPlayerNumber !== "spectator") {
        let cord_y = parseInt(ev.target.parentElement.id[0]);
        let cord_x = parseInt(ev.target.parentElement.id[2]);
        if (tableGridData[cord_y][cord_x].pieceColor === currentGameData[currentUserData.currentPlayerNumber].color) {
            if (currentUserData.currentPlayerNumber === currentGameData.turn) {
                let possibleMoves = calculatePossibleMoves(cord_y, cord_x);
                tagTableGrid(possibleMoves[0], possibleMoves[1], possibleMoves[2], possibleMoves[3]);
                ev.dataTransfer.setData("id", ev.target.parentElement.id);
            }
        }
    }

}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("id");
    if (data !== undefined) {
        let prev_y = data[0];
        let prev_x = data[2];
        let new_y;
        let new_x;
        if (ev.target.classList.contains("possibleMoveSquare") || ev.target.classList.contains("possibleKillSquare") ||
            ev.target.parentElement.classList.contains("possibleKillSquare")
        ) {
            if (ev.target.tagName === "IMG") {
                new_y = ev.target.parentElement.id[0];
                new_x = ev.target.parentElement.id[2];
            } else {
                new_y = ev.target.id[0];
                new_x = ev.target.id[2];
            }

            tableGridData[new_y][new_x].containsPieceResource = tableGridData[prev_y][prev_x].containsPieceResource;
            tableGridData[new_y][new_x].pieceColor = tableGridData[prev_y][prev_x].pieceColor;
            tableGridData[new_y][new_x].containsPiece = tableGridData[prev_y][prev_x].containsPiece;

            tableGridData[prev_y][prev_x].containsPieceResource = null;
            tableGridData[prev_y][prev_x].pieceColor = null;
            tableGridData[prev_y][prev_x].containsPiece = null;

            if (ev.target.classList.contains("promotionSquare")){
                promotePawn(new_y,new_x);
            }else {
                pushToDatabase();
                changeTurn();
            }
        }
    }
}

function promotePawn(pos_y, pos_x){
    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";
    let rootResourcePath = "gameFiles/resources/chessPieces/";

    let choiceCover = document.createElement("div");

    let knight = document.createElement("button");
    knight.className = "normalButton";
    knight.innerText = "Knight";
    knight.addEventListener("click", () => {

        if(tableGridData[pos_y][pos_x].pieceColor === "white"){
            tableGridData[pos_y][pos_x].containsPiece = "knight";
            tableGridData[pos_y][pos_x].pieceColor = "white";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "whiteKnight.png";
        }else{
            tableGridData[pos_y][pos_x].containsPiece = "knight";
            tableGridData[pos_y][pos_x].pieceColor = "black";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "blackKnight.png";
        }

        document.getElementById("inflatableDialog").style["display"] = "none";
        pushToDatabase();
        changeTurn();
    });

    let rook = document.createElement("button");
    rook.className = "normalButton";
    rook.innerText = "Rook";
    rook.addEventListener("click", () => {

        if(tableGridData[pos_y][pos_x].pieceColor === "white"){
            tableGridData[pos_y][pos_x].containsPiece = "rook";
            tableGridData[pos_y][pos_x].pieceColor = "white";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "whiteRook.png";
        }else{
            tableGridData[pos_y][pos_x].containsPiece = "rook";
            tableGridData[pos_y][pos_x].pieceColor = "black";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "blackRook.png";
        }

        document.getElementById("inflatableDialog").style["display"] = "none";
        pushToDatabase();
        changeTurn();
    });

    let bishop = document.createElement("button");
    bishop.className = "normalButton";
    bishop.innerText = "Bishop";
    bishop.addEventListener("click", () => {

        if(tableGridData[pos_y][pos_x].pieceColor === "white"){
            tableGridData[pos_y][pos_x].containsPiece = "bishop";
            tableGridData[pos_y][pos_x].pieceColor = "white";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "whiteBishop.png";
        }else{
            tableGridData[pos_y][pos_x].containsPiece = "bishop";
            tableGridData[pos_y][pos_x].pieceColor = "black";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "blackBishop.png";
        }

        document.getElementById("inflatableDialog").style["display"] = "none";
        pushToDatabase();
        changeTurn();
    });

    let queen = document.createElement("button");
    queen.className = "normalButton";
    queen.innerText = "Queen";
    queen.addEventListener("click", () => {

        if(tableGridData[pos_y][pos_x].pieceColor === "white"){
            tableGridData[pos_y][pos_x].containsPiece = "queen";
            tableGridData[pos_y][pos_x].pieceColor = "white";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "whiteQueen.png";
        }else{
            tableGridData[pos_y][pos_x].containsPiece = "queen";
            tableGridData[pos_y][pos_x].pieceColor = "black";
            tableGridData[pos_y][pos_x].containsPieceResource = rootResourcePath + "blackQueen.png";
        }

        document.getElementById("inflatableDialog").style["display"] = "none";
        pushToDatabase();
        changeTurn();
    });

    choiceCover.appendChild(knight);
    choiceCover.appendChild(rook);
    choiceCover.appendChild(bishop);
    choiceCover.appendChild(queen);

    inflatableDialogContent.appendChild(choiceCover);

    document.getElementById("inflatableDialog").style["display"] = "block";
}

function showMatchEndDialog(state){

    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";

    let cover = document.createElement("div");
    cover.className = "matchEndDialogCover";

    let mainText = document.createElement("h1");
    mainText.innerText = "You " + state;

    if (state === "Won"){
        mainText.className = "winHeader";
    }else if(state === "Lost"){
        mainText.className = "loseHeader";
    }

    if (currentUserData.authType === "verified"){
        let userRef = firebase.database().ref().child("userData").child(currentUserData.user.uid);
        if (currentUserData.gamesPlayed){
            userRef.child("gamesPlayed").set(currentUserData.gamesPlayed + 1);
        }else{
            userRef.child("gamesPlayed").set(1);
        }
        if (state === "Won"){
            if(currentUserData.gamesWon){
                userRef.child("gamesWon").set(currentUserData.gamesWon + 1);
            }else{
                userRef.child("gamesWon").set(1);
            }
        }else{
            if(!currentUserData.gamesWon){
                userRef.child("gamesWon").set(0);
            }
        }
    }
    cover.appendChild(mainText);

    let backButton = document.createElement("button");
    backButton.className = "normalButton";
    backButton.innerText = "Back to Table";
    backButton.addEventListener("click", () => {
        document.getElementById("inflatableDialog").style["display"] = "none";
    });
    cover.appendChild(backButton);
    inflatableDialogContent.appendChild(cover);

    document.getElementById("inflatableDialog").style["display"] = "block";
}

function showMatchEndDialogSpectator(snapshot){
    let tempData = snapshot.val();

    let inflatableDialogContent = document.getElementById("inflatableDialogContent");
    inflatableDialogContent.innerHTML = "";

    let cover = document.createElement("div");
    cover.className = "matchEndDialogCover";

    let winnerName = tempData[tempData["winner"]].name;

    let mainText = document.createElement("h1");
    mainText.innerText = winnerName + " Won";

    cover.appendChild(mainText);

    let backButton = document.createElement("button");
    backButton.className = "normalButton";
    backButton.innerText = "Back to Table";
    backButton.addEventListener("click", () => {
        document.getElementById("inflatableDialog").style["display"] = "none";
    });
    cover.appendChild(backButton);
    inflatableDialogContent.appendChild(cover);

    document.getElementById("inflatableDialog").style["display"] = "block";
}

function createNewTableGrid() {
    let tableGrid = document.getElementById("boardGrid");
    tableGrid.innerHTML = "";
    tableGridData = [];
    let isBlack = false;
    for (let y = 0; y<8; y++){
        let tableRow = document.createElement("tr");
        tableGridData[y] = [];
        for (let x = 0; x<8; x++){
            let tableField = document.createElement("td");
            tableField.id = y+","+x;
            tableField.addEventListener("dragover", allowDrop);
            tableField.addEventListener("drop", drop);
            tableGridData[y][x] = new tableGridDataContainer;
            tableGridData[y][x].htmlHandler = y+","+x;

            tableField.draggable = false;
            if (isBlack){
                tableField.className = "boardBlackSquare";
                isBlack = !isBlack;
            }else{
                tableField.className = "boardWhiteSquare";
                isBlack = !isBlack;
            }
            tableRow.appendChild(tableField);
        }
        isBlack = !isBlack;
        tableGrid.appendChild(tableRow);
    }
}

function renderTableGridPieces() {
    for (let y=0; y<8; y++){
        for (let x=0; x<8; x++){
            let htmlHandler = document.getElementById(tableGridData[y][x].htmlHandler);
            htmlHandler.innerText = "";
            if (tableGridData[y][x].containsPiece){
                let pieceContainer = document.createElement("img");
                pieceContainer.src = tableGridData[y][x].containsPieceResource;
                pieceContainer.draggable = true;
                pieceContainer.title = tableGridData[y][x].pieceColor + " "  + tableGridData[y][x].containsPiece;
                pieceContainer.addEventListener("dragstart", drag);
                htmlHandler.appendChild(pieceContainer);
            }
        }
    }
}

function setStartPositions() {
    let rootResourcePath = "gameFiles/resources/chessPieces/";

    for (let x = 0; x <8 ; x++){

        tableGridData[1][x].containsPiece = "pawn";
        tableGridData[1][x].pieceColor = "white";
        tableGridData[1][x].containsPieceResource = rootResourcePath + "whitePawn.png";

        tableGridData[6][x].containsPiece = "pawn";
        tableGridData[6][x].pieceColor = "black";
        tableGridData[6][x].containsPieceResource = rootResourcePath + "blackPawn.png";
    }

    function setWhitePieces() {
        tableGridData[0][0].containsPiece = "rook";
        tableGridData[0][0].pieceColor = "white";
        tableGridData[0][0].containsPieceResource = rootResourcePath + "whiteRook.png";

        tableGridData[0][7].containsPiece = "rook";
        tableGridData[0][7].pieceColor = "white";
        tableGridData[0][7].containsPieceResource = rootResourcePath + "whiteRook.png";

        tableGridData[0][2].containsPiece = "bishop";
        tableGridData[0][2].pieceColor = "white";
        tableGridData[0][2].containsPieceResource = rootResourcePath + "whiteBishop.png";

        tableGridData[0][5].containsPiece = "bishop";
        tableGridData[0][5].pieceColor = "white";
        tableGridData[0][5].containsPieceResource = rootResourcePath + "whiteBishop.png";

        tableGridData[0][1].containsPiece = "knight";
        tableGridData[0][1].pieceColor = "white";
        tableGridData[0][1].containsPieceResource = rootResourcePath + "whiteKnight.png";

        tableGridData[0][6].containsPiece = "knight";
        tableGridData[0][6].pieceColor = "white";
        tableGridData[0][6].containsPieceResource = rootResourcePath + "whiteKnight.png";

        tableGridData[0][4].containsPiece = "king";
        tableGridData[0][4].pieceColor = "white";
        tableGridData[0][4].containsPieceResource = rootResourcePath + "whiteKing.png";

        tableGridData[0][3].containsPiece = "queen";
        tableGridData[0][3].pieceColor = "white";
        tableGridData[0][3].containsPieceResource = rootResourcePath + "whiteQueen.png";
    }

    function setBlackPieces() {
        tableGridData[7][0].containsPiece = "rook";
        tableGridData[7][0].pieceColor = "black";
        tableGridData[7][0].containsPieceResource = rootResourcePath + "blackRook.png";

        tableGridData[7][7].containsPiece = "rook";
        tableGridData[7][7].pieceColor = "black";
        tableGridData[7][7].containsPieceResource = rootResourcePath + "blackRook.png";

        tableGridData[7][2].containsPiece = "bishop";
        tableGridData[7][2].pieceColor = "black";
        tableGridData[7][2].containsPieceResource = rootResourcePath + "blackBishop.png";

        tableGridData[7][5].containsPiece = "bishop";
        tableGridData[7][5].pieceColor = "black";
        tableGridData[7][5].containsPieceResource = rootResourcePath + "blackBishop.png";

        tableGridData[7][1].containsPiece = "knight";
        tableGridData[7][1].pieceColor = "black";
        tableGridData[7][1].containsPieceResource = rootResourcePath + "blackKnight.png";

        tableGridData[7][6].containsPiece = "knight";
        tableGridData[7][6].pieceColor = "black";
        tableGridData[7][6].containsPieceResource = rootResourcePath + "blackKnight.png";

        tableGridData[7][4].containsPiece = "king";
        tableGridData[7][4].pieceColor = "black";
        tableGridData[7][4].containsPieceResource = rootResourcePath + "blackKing.png";

        tableGridData[7][3].containsPiece = "queen";
        tableGridData[7][3].pieceColor = "black";
        tableGridData[7][3].containsPieceResource = rootResourcePath + "blackQueen.png";
    }

    setWhitePieces();
    setBlackPieces();
}

function startGame(){
    if (currentUserData.currentGamePermisstions !== "Host")
        return;

    if (currentGameData.player2 && currentGameData.player1){
        if (!currentGameData.winner) {
            tableDatabaseReference.child("state").set("started");
            tableDatabaseReference.child("running").set(true);
        }else{
            showSnackbarAlert("Game ended");
        }
    }else if(currentGameData.player1){
        showSnackbarAlert("Cannot Start\nWaiting for player two");
    }else if(currentGameData.player2){
        showSnackbarAlert("Cannot Start\nWaiting for player one")
    }
}

function changeTurn() {
    if (currentUserData.currentPlayerNumber === "player1"){
        currentGameData.turn = "player2"
    }
    else{
        currentGameData.turn = "player1"
    }
    tableDatabaseReference.child("turn").set(currentGameData.turn);
}

function forfeitMatch(){
    if (currentUserData.currentPlayerNumber === "player1"){
        tableDatabaseReference.child("state").set(currentGameData.player2.name + " Won");
        tableDatabaseReference.child("winner").set("player2");
        tableDatabaseReference.child("running").set(false);
    }else if(currentUserData.currentPlayerNumber === "player2"){
        tableDatabaseReference.child("state").set(currentGameData.player1.name + " Won");
        tableDatabaseReference.child("winner").set("player1");
        tableDatabaseReference.child("running").set(false);
    }else{
        showSnackbarAlert("Spectators can't forfeit");
    }
}
