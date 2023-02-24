#include <stdio.h>
#include <stdlib.h>
#include "game.h"

// int isPathClear(Position from, Position to);
// int rook(Position to, Piece piece);
// int knight(Position to, Piece piece);
// int bishop(Position to, Piece piece);
// int queen(Position to, Piece piece);
// int king(Position to, Piece piece);
// int pawn(Position to, Piece piece);

Position enPassasntSquare;
int enPassasnt = 0;
int castling = 15;

int isPathClear(Position from, Position to){
    int x = to.x - from.x;
    int y = to.y - from.y;
    if(x == 0){
        int increment = y > 0 ? 1 : -1;
        for(int i = from.y + increment; i != to.y; i += increment){
            if(board[from.x][i].piece != ' '){
                return 0;
            }
        }
    }else if(y == 0){
        int increment = y > 0 ? 1 : -1;
        for(int i = from.x + increment; i != to.x; i += increment){
            if(board[i][from.y].piece != ' '){
                return 0;
            }
        }
    }else if(abs(x) == abs(y)){
        int incrementY = y > 0 ? 1: -1;
        int incrementX = x > 0 ? 1: -1;
        for(int i = from.x + incrementX, j = from.y + incrementY; i != to.x; i += incrementX, j += incrementY){
            if(board[i][j].piece != ' '){
                // printf("%c\n", board[i][j].piece);
                return 0;
            }
        }
    }else{
        return 0;
    }
    return 1;
}

int rook(Position to, Piece piece){
    int move = (piece.position.x == to.x || piece.position.y == to.y);
    return move && isPathClear(piece.position, to);
}

int knight(Position to, Piece piece){
    int move1 = (abs(piece.position.x - to.x) == 2) && (abs(piece.position.y - to.y) == 1);
    int move2 = (abs(piece.position.x - to.x) == 1) && (abs(piece.position.y - to.y) == 2);
    return move1 || move2;
}

int bishop(Position to, Piece piece){
    int move = abs(piece.position.x - to.x) == abs(piece.position.y - to.y);
    return move && isPathClear(piece.position, to);
}

int queen(Position to, Piece piece){
    int move1 = (piece.position.x == to.x || piece.position.y == to.y);
    int move2 = (abs(piece.position.x - to.x) == abs(piece.position.y - to.y));
    return (move1 || move2) && isPathClear(piece.position, to);
}

int king(Position to, Piece piece){
    int side;
    if(piece.color == WHITE && abs(piece.position.y - to.y) == 2){
        if(to.y == 2 && (castling && 8) > 0){
            side = 0;
        }else if(to.y == 6 && (castling && 4) > 0){
            side = 7;
        }else{
            return 0;
        }
        to.y = side;
        return isPathClear(piece.position, to);
    }else if(piece.color == BLACK && abs(piece.position.y - to.y) == 2){
        if(to.y == 2 && (castling & 2) > 0){
            side = 0;
        }else if(to.y == 6 && (castling & 1) > 0){
            side = 7;
        }else{
            return 0;
        }
        to.y = side;
        return isPathClear(piece.position, to);
    }
    int move1 = (piece.position.x == to.x || piece.position.y == to.y);
    int move2 = (abs(piece.position.x - to.x) == abs(piece.position.y - to.y));
    int oneSquare = ((abs(piece.position.x - to.x) == 1) || abs(piece.position.x - to.x) == 0) && ((abs(piece.position.y - to.y) == 1) || abs(piece.position.y - to.y) == 0);
    return ((move1 || move2) && oneSquare);
}

int pawn(Position to, Piece piece){
    if(piece.color == WHITE){ // White can't move backwards
        if(piece.position.x - to.x < 0){
            return 0;
        }
    }else if(piece.color == BLACK){ // Black can't move backwards
        if(to.x - piece.position.x < 0){
            return 0;
        }
    }
    int push = (abs(to.x - piece.position.x) == 1 && piece.position.y == to.y && board[to.x][to.y].piece == ' ');
    int capture = (abs(to.x - piece.position.x) == 1 && abs(to.y - piece.position.y) == 1 && board[to.x][to.y].piece != ' ');
    int twoPush = (abs(to.x - piece.position.x) == 2 && ((piece.position.x == 6) || (piece.position.x == 1)) && piece.position.y == to.y && board[to.x][to.y].piece == ' ');
    // printf("Push %d\n", push);
    // printf("Capture %d\n", capture);
    // printf("Two Push %d\n", twoPush);
    if(enPassasnt && (to.x == enPassasntSquare.x) && (to.y == enPassasntSquare.y) && abs(to.x - piece.position.x) == 1 && abs(to.y - piece.position.y) == 1){
        return 1;
    }
    if(twoPush){
        if(piece.position.x == 6){
            if(board[5][to.y] != ' '){
                twoPush = !twoPush;
            }
        }else if(piece.position.x == 1){
            if(board[2][to.y] != ' '){
                twoPush = !twoPush;
            }
        }
    }
    return push || capture || twoPush;
}