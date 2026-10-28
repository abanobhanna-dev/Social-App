import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function useBookMark() {
  const queryClient = useQueryClient();

  const { mutate: toggleBookmark, isPending: PendingBookmark } = useMutation({
    mutationFn: (postId: string) =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: (res) => {
      toast.success(res.data.message || "Done");
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getUsePosts"] });
      queryClient.invalidateQueries({ queryKey: ["getBookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return { toggleBookmark, PendingBookmark };
}
