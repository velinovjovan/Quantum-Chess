export const matchWithBot = async (
  setIsSearching,
  supabase,
  userId,
  navigate
) => {
  setIsSearching(false);
  await supabase.from("matchmaking_queue").delete().eq("user_id", userId);
  navigate("/match");
};
