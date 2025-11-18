public class classroom{
    public static void nqueens(char board[][], int row){
        //base case
        if(row==board.length){
            printBoard(board);
            return;
        }

        //column loop
        for(int j=0;j<board.length;j++){
            if(isSafe(board,row,j)){
                board[row][j]='Q';
                nqueens(board,row+1);//function call
                board[row][j]='X';//backtracking step
            }
        }
    }
    public static void printBoard(char board[][]){
        System.out.println("-----Chess Board-----");
        for(int i=0;i<board.length;i++){
            for(int j=0;j<board.length;j++){
                System.out.print(board[i][j]+" ");
            }
            System.out.println();
        }
    }public static void main(String args[]){
        int n=4;
        char board[][]=new char[n][n];
        //initialize the chess board
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                board[i][j]='X';
            }
        }
        nqueens(board,0);
    }
}