#include <stdio.h>
#include "game.h"

Piece board[BOARD_SIZE][BOARD_SIZE];

void initBoard(Piece board[BOARD_SIZE][BOARD_SIZE]){
    board[0][0] = (Piece){'R', {0, 0}, BLACK, 0};
    board[0][1] = (Piece){'N', {0, 1}, BLACK, 0};
    board[0][2] = (Piece){'B', {0, 2}, BLACK, 0};
    board[0][3] = (Piece){'Q', {0, 3}, BLACK, 0};
    board[0][4] = (Piece){'K', {0, 4}, BLACK, 0};
    board[0][5] = (Piece){'B', {0, 5}, BLACK, 0};
    board[0][6] = (Piece){'N', {0, 6}, BLACK, 0};
    board[0][7] = (Piece){'R', {0, 7}, BLACK, 0};
    for(int i = 0; i < BOARD_SIZE; i++){
        board[1][i] = (Piece){'P', {1, i}, BLACK, 0};
        board[6][i] = (Piece){'P', {6, i}, WHITE, 0};
    }
    board[7][0] = (Piece){'R', {7, 0}, WHITE, 0};
    board[7][1] = (Piece){'N', {7, 1}, WHITE, 0};
    board[7][2] = (Piece){'B', {7, 2}, WHITE, 0};
    board[7][3] = (Piece){'Q', {7, 3}, WHITE, 0};
    board[7][4] = (Piece){'K', {7, 4}, WHITE, 0};
    board[7][5] = (Piece){'B', {7, 5}, WHITE, 0};
    board[7][6] = (Piece){'N', {7, 6}, WHITE, 0};
    board[7][7] = (Piece){'R', {7, 7}, WHITE, 0};

    for (int i = 2; i < 6; i++) {
        for (int j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = (Piece) {' ', {i, j}, NONE, 0};
        }
    }
}

void printBoard(Piece board[BOARD_SIZE][BOARD_SIZE]){
    for(int row = 0; row < BOARD_SIZE; row++){
        for(int col = 0; col < BOARD_SIZE; col++){
            if(board[row][col].piece == '\0'){
                printf("[ ]");
            }else{
                printf("[%c]", board[row][col].piece);
            }
        }
        printf("\n");
    }
}



int main(){
    initBoard(board);
    printBoard(board);
    return 0;
}