import { useFollowUser } from "../../hooks/useFollowUser";

export default function FollowButton({ userId }) {
  const { mutate, isPending } = useFollowUser();

  return (
    <button
      onClick={() => mutate(userId)}
      disabled={isPending}
      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
    >
      {isPending ? "Following..." : "Follow"}
    </button>
  );
}