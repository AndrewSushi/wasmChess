let enPassant = false // If there was a enPassant previous last move
let enPassantSquare = null // enPassant Square
let whiteTurn = true // Turn checking

let castling = 15 // Binary representation of 0x1111 rooks 0xwL wR bL bR

let previousMove = [] // Previous move
let potentialList = []
let wKPos = [7, 4]
let bKPos = [0, 4]

// Piece Moving
function movePiece(fromX, fromY, toX, toY){
    /*
    This is a function to move the piece
    */
   piece = board[fromX][fromY]
    if((piece[0] == 'b') && (whiteTurn)){
        return false
    }else if((piece[0] == 'w') && (!whiteTurn)){
        return false
    }
    if(isValidMove(fromX, fromY, toX, toY)){
        potentialList = []
        if(previousMove.length > 0){
            boardHTML.rows[previousMove[0][0]].cells[previousMove[0][1]].classList.remove("previous")
            boardHTML.rows[previousMove[1][0]].cells[previousMove[1][1]].classList.remove("previous")
        }
        if(board[fromX][fromY][1] == 'K'){
            moveKing(fromX, fromY, toX, toY)
        }
        if(board[fromX][fromY][1] == 'R'){
            moveRook(fromX, fromY, toX, toY)
        }
        if(board[fromX][fromY][1] == 'P'){
            movePawn(fromX, fromY, toX, toY)
        }

        board[toX][toY] = board[fromX][fromY]; // Move the piece to desired location
        board[fromX][fromY] = '' // Make the previous location empty
        previousMove[0] = [fromX, fromY] // Setting the previous move array
        previousMove[1] = [toX, toY]

        boardHTML.rows[fromX].cells[fromY].classList.add("previous")
        boardHTML.rows[toX].cells[toY].classList.add("previous")
        
        if(board[toX][toY][1] == 'K'){
            if(board[toX][toY][0] == "w"){
                wKPos = [toX, toY]
            }else if(board[toX][toY][0] == "b"){
                bKPos = [toX, toY]
            }
        }

        renderBoard() // Render the board twice to update the changes
        renderBoard()
        whiteTurn = !whiteTurn // Change turns
        if(whiteTurn){
            isCheck(wKPos)
        }else{
            isCheck(bKPos)
        }
    }
}

function moveRook(fromX, fromY, toX, toY){
    piece = board[fromX][fromY]
    move1 = (fromX == toX || fromY == toY)
    if(move1 & isPathClear(fromX, fromY, toX, toY)){
        if(piece[0] == 'w' & fromY == 0){
            castling = castling & 0b0111
        }else if(piece[0] == 'w' & fromY == 7){
            castling = castling & 0b1011
        }else if(piece[0] == 'b' & fromY == 0){
            castling = castling & 0b1101
        }else if(piece[0] == 'b' & fromY == 7){
            castling = castling & 0b1110
        }
        return true
    }
}

function movePawn(fromX, fromY, toX, toY){
    piece = board[fromX][fromY]
    if(piece[0] == 'w'){
        if(fromX - toX < 0){
            return false
        }
    }else{
        if(toX - fromX < 0){
            return false
        }
    }
    let normalPush = (Math.abs(toX - fromX) === 1 && toY === fromY && board[toX][toY] === '');
    let capture = (Math.abs(toX - fromX) === 1 && Math.abs(toY - fromY) === 1 && board[toX][toY] !== '');
    let twoPush = (Math.abs(toX - fromX) === 2 && ((fromX === 6) || (fromX === 1)) && toY === fromY && board[toX][toY] === '');
    if(enPassant && (toX == enPassantSquare[0]) && (toY == enPassantSquare[1])){
        if(piece[0] == 'w'){
            board[toX + 1][toY] = ''
        }else{
            board[toX - 1][toY] = ''
        }
        return true
    }
    if(twoPush){
        if(fromX === 6){
            if(board[5][fromY] != ''){
                twoPush = !twoPush
            }
        }else if(fromX === 1){
            if(board[2][fromY] != ''){
                twoPush = !twoPush
            }
        }
        enPassant = true
        enPassantSquare = [(fromX + toX) / 2, fromY]
    }else{
        enPassant = false
        enPassantSquare = null
    }
    return normalPush || capture || twoPush;
}

function moveKing(fromX, fromY, toX, toY){
    piece = board[fromX][fromY]
    if(piece[0] == 'w' && Math.abs(fromY - toY) == 2){
        if(toY == 2 & ((castling & 0b1000) > 0)){
            side = 0;
        }else if(toY == 6 & ((castling & 0b0100) > 0)){
            side = 7
        }else{
            return false
        }
        if(isPathClear(fromX, fromY, toX, side)){
            board[fromX][side] = '';
            board[fromX][side == 0 ? 3 : 5] = 'wR';
            castling = castling & 0b0011
            return true;
        }
    }else if(piece[0] == 'b' && Math.abs(fromY - toY) == 2){
        if(toY == 2 & ((castling & 0b0010) > 0)){
            side = 0;
        }else if(toY == 6 & ((castling & 0b0001) > 0)){
            side = 7
        }else{
            return false
        }
        if(isPathClear(fromX, fromY, toX, side)){
            board[fromX][side] = '';
            board[fromX][side == 0 ? 3 : 5] = 'bR';
            castling = castling & 0b1100
            return true;
        }
    }
    move1 = (fromX == toX || fromY == toY)
    move2 = (Math.abs(fromX - toX) == Math.abs(fromY - toY))
    oneSquare = ((Math.abs(fromX - toX) == 1) || (Math.abs(fromX - toX) == 0)) && ((Math.abs(fromY - toY) == 1) || (Math.abs(fromY - toY) == 0))
    if((move1 || move2) && oneSquare){
        if(piece[0] == 'w'){
            castling = castling & 0b0011
        }else{
            castling = castling & 0b1100
        }
        return true
    }
    return false
}

function isPathClear(fromX, fromY, toX, toY){ 
    x = toX - fromX
    y = toY - fromY
    if(x == 0){
        let increment = y > 0 ? 1 : -1;
        for(let i = fromY + increment; i != toY; i += increment){
            if(board[fromX][i] != ''){
                return false;
            }
        }
    }else if(y == 0){
        let increment = x > 0 ? 1 : -1;
        for(let i = fromX + increment; i != toX; i += increment){
            if(board[i][fromY] != ''){
                return false
            }
        }
    }else if(Math.abs(x) == Math.abs(y)){
        let incrementY = y > 0 ? 1 : -1;
        let incrementX = x > 0 ? 1 : -1;
        for(let i = fromX + incrementX, j = fromY + incrementY; i != toX; i += incrementX, j += incrementY){
            if(board[i][j] != ''){
                return false
            }
        }
    }else{
        return false
    }
    return true
}

function rook(fromX, fromY, toX, toY, piece){
    move1 = (fromX == toX || fromY == toY)
    return (move1 & isPathClear(fromX, fromY, toX, toY))
}

function knight(fromX, fromY, toX, toY){
    let move1 = (Math.abs(fromX - toX) === 2) && (Math.abs(fromY - toY) === 1)
    let move2 = (Math.abs(fromX - toX) === 1) && (Math.abs(fromY - toY) === 2)
    return move1 || move2
}

function bishop(fromX, fromY, toX, toY){
    move1 = (Math.abs(fromX - toX) == Math.abs(fromY - toY))
    return move1 & isPathClear(fromX, fromY, toX, toY)
}

function queen(fromX, fromY, toX, toY){
    move1 = (fromX == toX || fromY == toY)
    move2 = (Math.abs(fromX - toX) == Math.abs(fromY - toY))
    return (move1 || move2) & isPathClear(fromX, fromY, toX, toY)
}

function king(fromX, fromY, toX, toY, piece){
    if(piece[0] == 'w' && Math.abs(fromY - toY) == 2){
        if(toY == 2 & ((castling & 0b1000) > 0)){
            side = 0;
        }else if(toY == 6 & ((castling & 0b0100) > 0)){
            side = 7
        }else{
            return false
        }
        return isPathClear(fromX, fromY, toX, side)
    }else if(piece[0] == 'b' && Math.abs(fromY - toY) == 2){
        if(toY == 2 & ((castling & 0b0010) > 0)){
            side = 0;
        }else if(toY == 6 & ((castling & 0b0001) > 0)){
            side = 7
        }else{
            return false
        }
        return isPathClear(fromX, fromY, toX, side)
    }
    move1 = (fromX == toX || fromY == toY)
    move2 = (Math.abs(fromX - toX) == Math.abs(fromY - toY))
    oneSquare = ((Math.abs(fromX - toX) == 1) || (Math.abs(fromX - toX) == 0)) && ((Math.abs(fromY - toY) == 1) || (Math.abs(fromY - toY) == 0))
    return ((move1 || move2) && oneSquare)
}

function pawn(fromX, fromY, toX, toY, piece){
    if(piece[0] == 'w'){
        if(fromX - toX < 0){
            return false
        }
    }else{
        if(toX - fromX < 0){
            return false
        }
    }
    let normalPush = (Math.abs(toX - fromX) === 1 && toY === fromY && board[toX][toY] === '');
    let capture = (Math.abs(toX - fromX) === 1 && Math.abs(toY - fromY) === 1 && board[toX][toY] !== '');
    let twoPush = (Math.abs(toX - fromX) === 2 && ((fromX === 6) || (fromX === 1)) && toY === fromY && board[toX][toY] === '');
    if(enPassant && (toX == enPassantSquare[0]) && (toY == enPassantSquare[1]) && (Math.abs(toX - fromX) === 1 && Math.abs(toY - fromY) === 1)){
        return true
    }
    if(twoPush){
        if(fromX === 6){
            if(board[5][fromY] != ''){
                twoPush = !twoPush
            }
        }else if(fromX === 1){
            if(board[2][fromY] != ''){
                twoPush = !twoPush
            }
        }
    }
    return normalPush || capture || twoPush;
}

// Validation checking
function isValidMove(fromX, fromY, toX, toY){
    let piece = board[fromX][fromY];

    if(fromX == toX & fromY == toY){
        // console.log("Error1")
        return false
    }
    if(piece == board[toX][toY]){
        // console.log("Error2")
        return false
    }
    if(piece[0] === board[toX][toY][0]){
        // console.log("Error3")
        return false
    }
    switch(piece[1]){
        case 'R':
            enPassant = false
            return rook(fromX, fromY, toX, toY, piece)
        case 'N':
            enPassant = false
            return knight(fromX, fromY, toX, toY, piece)
        case 'B':
            enPassant = false
            return bishop(fromX, fromY, toX, toY, piece)
        case 'Q':
            enPassant = false
            return queen(fromX, fromY, toX, toY, piece)
        case 'K':
            enPassant = false
            return king(fromX, fromY, toX, toY, piece)
        case 'P':
            return pawn(fromX, fromY, toX, toY, piece)
    }
    return true
}

function showValidSquares(x, y){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(isValidMove(x, y, i, j)){
                let dot = document.createElement("div");
                if(board[i][j] != ''){
                    dot.classList.add("capture");
                    boardHTML.rows[i].cells[j].classList.add("capture")
                }else{
                    dot.classList.add("potential");
                }
                boardHTML.rows[i].cells[j].appendChild(dot);
                potentialList.push([i, j])
            }
        }
    }
}

function removePotential(){
    for(let idx = 0; idx < potentialList.length; idx++){
        let square = potentialList[idx]
        let piece = boardHTML.rows[square[0]].cells[square[1]]
        piece.removeChild(piece.lastChild)
    }
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            boardHTML.rows[i].cells[j].classList.remove("capture")
        }
    }
    potentialList = []
}