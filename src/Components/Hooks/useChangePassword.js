import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export function useChangePassword() {
  return useMutation({
    mutationFn: (formData) =>
      axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      ),

    onSuccess: (res) => {
      const newToken = res?.data?.token;

      if (newToken) {
        localStorage.setItem("userToken", newToken);
      }

      toast.success("Password updated successfully ✅"); // 🔥 هنا
    },

    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Something went wrong ❌"
      ); // 🔥 وهنا
    },
  });
}