export  function formatTimeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diffInHours = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60 * 60),
  );
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
}
export  function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

