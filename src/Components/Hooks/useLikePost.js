import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useLikePost(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => {
      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (postId) => {
      // 🔥 UPDATE POSTS (زي ما انت عامل)
      const queries = queryClient.getQueriesData({ queryKey: ["posts"] });

      queries.forEach(([key]) => {
        queryClient.setQueryData(key, (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) => {
                if (p._id === postId) {
                  const liked = p.likes?.includes(userId);

                  return {
                    ...p,
                    likes: liked
                      ? p.likes.filter((id) => id !== userId)
                      : [...p.likes, userId],

                    likesCount: liked
                      ? (p.likesCount || p.likes.length) - 1
                      : (p.likesCount || p.likes.length) + 1,
                  };
                }
                return p;
              }),
            })),
          };
        });
      });

      // 🔥🔥🔥 أهم جزء → PostDetails
      queryClient.setQueryData(["getSinglePosts", postId], (old) => {
        if (!old) return old;

        const p = old.data.data.post;
        const liked = p.likes?.includes(userId);

        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== userId)
                  : [...p.likes, userId],

                likesCount: liked
                  ? (p.likesCount || p.likes.length) - 1
                  : (p.likesCount || p.likes.length) + 1,
              },
            },
          },
        };
      });
    },

    // ✅ ناخد الداتا الصح من السيرفر
    onSuccess: (res, postId) => {
      const updatedPost = res.data.data.post;

      const queries = queryClient.getQueriesData({ queryKey: ["posts"] });

      queries.forEach(([key]) => {
        queryClient.setQueryData(key, (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p._id === postId ? updatedPost : p,
              ),
            })),
          };
        });
      });

      // 🔥 مهم للـ details
      queryClient.setQueryData(["getSinglePosts", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              post: updatedPost,
            },
          },
        };
      });
    },
  });
}
