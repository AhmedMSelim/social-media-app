import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePostLikes(postId) {
  return useQuery({
    queryKey: ["postLikes", postId],
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/likes`,
        {
          params: {
            page: 1,
            limit: 20,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      ),

    enabled: !!postId, // يشتغل بس لما يبقى فيه id
  });
}