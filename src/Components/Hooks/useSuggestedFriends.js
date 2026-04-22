
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useSuggestedFriends() {
  return useQuery({
    queryKey: ["suggestedFriends"],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");

      const { data } = await axios.get(
        "https://route-posts.routemisr.com/users/suggestions?limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SUGGESTIONS:", data);

      return data?.data?.suggestions || [];
    },
  });
}