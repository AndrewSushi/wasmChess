#ifndef GAME_H
#define GAME_H

// Constants
#define BOARD_SIZE 8

// Structs
typedef struct{
    int x;
    int y;
} Position;

typedef struct{
    char piece; // Type of piece
    Position position; // x, y co-ordinate of the piece
    int color; // 1 if white 0 is black
    int hasMoved; // 1 if the piece has move, 0 if not
} Piece;

extern Piece board[BOARD_SIZE][BOARD_SIZE];
extern int x;

// Functions
void initBoard(Piece board[BOARD_SIZE][BOARD_SIZE]);
void movePiece(Piece board[BOARD_SIZE][BOARD_SIZE], Position start, Position end);
void displayLegalMoves(Piece board[BOARD_SIZE][BOARD_SIZE], Position position);
void printBoard(Piece board[BOARD_SIZE][BOARD_SIZE]);
int isGameOver(Piece board[BOARD_SIZE][BOARD_SIZE]);
int isCheck(Piece board[BOARD_SIZE][BOARD_SIZE], int color);
int isCheckmate(Piece board[BOARD_SIZE][BOARD_SIZE], int color);
int isStalemate(Piece board[BOARD_SIZE][BOARD_SIZE], int color);
int isThreeFoldRepetition(Piece board[BOARD_SIZE][BOARD_SIZE]);
int isValidMove(Piece board[BOARD_SIZE][BOARD_SIZE], Position start, Position end);

#endif