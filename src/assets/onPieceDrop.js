export const onPieceDrop = async (
  from,
  to,
  isBotMatch,
  chess,
  matchId,
  userId,
  playerColor,
  syncBoard,
  setMoveHistory,
  supabase
) => {
  // Bot match logic
  if (isBotMatch) {
    if (chess.turn() !== "w") return false;

    const move = chess.move({
      from,
      to,
      promotion: "q",
    });

    if (!move) return false;

    syncBoard();
    setMoveHistory(chess.history({ verbose: true }));
    return true;
  }

  // Online match logic
  if (!matchId || !userId || !playerColor) return false;
  if (chess.turn() !== playerColor) return false;

  const piece = chess.get(from);
  if (!piece || piece.color !== playerColor) return false;

  const move = chess.move({
    from,
    to,
    promotion: "q",
  });

  if (!move) return false;

  chess.undo();

  const { error } = await supabase.from("match_moves").insert({
    match_id: matchId,
    player_id: userId,
    move: {
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    },
  });

  if (error) {
    console.error("Failed to send move", error);
    return false;
  }

  return true;
};
