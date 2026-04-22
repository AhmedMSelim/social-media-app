import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) =>
      axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });
}