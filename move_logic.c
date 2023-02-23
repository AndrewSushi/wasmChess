#include <stdio.h>
#include <stdlib.h>
#include "game.h"

int isPathClear(Position from, Position to);
int rook(Position to, Piece piece);
int knight(Position to, Piece piece);
int bishop(Position to, Piece piece);
int queen(Position to, Piece piece);
int king(Position to, Piece piece);
int pawn(Position to, Piece piece);

int isPathClear(Position from, Position to){
    int x = to.x - from.x;
    int y = to.y - from.y;
    if(x == 0){
        int increment = y > 0 ? 1 : -1;
        for(int i = from.y + increment; i != to.y; i += increment){
            if(board[from.x][i].piece != '\0'){
                return 0;
            }
        }
    }else if(y == 0){
        int increment = y > 0 ? 1 : -1;
        for(int i = from.x + increment; i != to.x; i += increment){
            if(board[i][from.y].piece != '\0'){
                return 0;
            }
        }
    }else if(abs(x) == abs(y)){
        int incrementY = y > 0 ? 1: -1;
        int incrementX = x > 0 ? 1: -1;
        for(int i = from.x + incrementX, j = from.y + incrementY; i != to.x; i += incrementX, j += incrementY){
            if(board[i][j].piece != '\0'){
                return 0;
            }
        }
    }else{
        return 0;
    }
    return 1;
}

int rook(Position to, Piece piece){
    // printBoard(board);
    printf("%d,%d\n", piece.position.x, piece.position.y);
    printf("Goes to: %d,%d\n", to.x, to.y);
}

int bishop(Position to, Piece piece){
    int move = abs(piece.position.x - to.x) == abs(piece.position.y - to.y);
    return move;
}

