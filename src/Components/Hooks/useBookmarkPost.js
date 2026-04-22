import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      ),

    // ✅ Optimistic بسيط
    onMutate: async (postId) => {
      // وقف أي fetch شغال
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["postDetails"] });

      // 🔥 update feed فقط
      const postsQueries = queryClient.getQueriesData({
        queryKey: ["posts"],
      });

      postsQueries.forEach(([key, data]) => {
        if (!data?.pages) return;

        queryClient.setQueryData(key, (old) => ({
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p._id === postId
                ? { ...p, bookmarked: !p.bookmarked }
                : p
            ),
          })),
        }));
      });

      // 🔥 update postDetails
      queryClient.setQueryData(["postDetails", postId], (old) => {
        if (!old?.data?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              bookmarked: !old.data.data.bookmarked,
            },
          },
        };
      });
    },

    // ✅ بعد ما السيرفر يرد
   onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
}
  });
}