function findLegalMovesForPawn(board, pawn) {
  const legalMoves = [];

  // Check if the pawn can move forward.
  const forwardSquare = board[pawn.row + 1][pawn.column];
  if (forwardSquare === null) {
    legalMoves.push(forwardSquare);
  }

  // Check if the pawn can capture an enemy piece diagonally forward.
  const diagonalForwardLeftSquare = board[pawn.row + 1][pawn.column - 1];
  const diagonalForwardRightSquare = board[pawn.row + 1][pawn.column + 1];
  if (diagonalForwardLeftSquare !== null && diagonalForwardLeftSquare.color !== pawn.color) {
    legalMoves.push(diagonalForwardLeftSquare);
  }
  if (diagonalForwardRightSquare !== null && diagonalForwardRightSquare.color !== pawn.color) {
    legalMoves.push(diagonalForwardRightSquare);
  }

  // Check if the pawn can move two squares forward on its first move.
  if (pawn.row === 1 && board[pawn.row + 2][pawn.column] === null) {
    legalMoves.push(board[pawn.row + 2][pawn.column]);
  }

  return legalMoves;
}