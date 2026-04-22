import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) =>
      axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},

        {
          
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),

    // ✅ بعد النجاح بس
    onSuccess: async (res, userId) => {
      try {
        const token = localStorage.getItem("userToken");

        // 🧠 نجيب واحد جديد
        const { data } = await axios.get(
          "https://route-posts.routemisr.com/users/suggestions?limit=1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newUser = data?.data?.suggestions?.[0];

        queryClient.setQueryData(["suggestedFriends"], (old) => {
          // نشيل القديم
          const filtered = old?.filter((u) => u._id !== userId);

          // نضيف الجديد
          return newUser ? [...filtered, newUser] : filtered;
        });
      } catch (err) {
        console.log("error fetching new suggestion");
      }
    },
  });
}
