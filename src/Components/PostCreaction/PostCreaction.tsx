import { FiImage, FiSend } from "react-icons/fi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImSpinner11 } from "react-icons/im";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
export default function PostCreaction() {
  const [isUploaded, setIsUploaded] = useState("");
  const queryClient = useQueryClient();
  const textInput = useRef<HTMLTextAreaElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);

  function createPost(formData: FormData) {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function clearForm() {
    if (textInput.current) {
      textInput.current.value = "";
    }
    if (imgInput.current) {
      imgInput.current.value = "";
    }
    setIsUploaded("");
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      clearForm();
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  function handleCreatePost() {
    const hasText = textInput.current?.value?.trim();
    const hasImage = imgInput.current?.files?.[0];

    if (!hasText && !hasImage) return;

    const formData = new FormData();

    if (hasText) {
      formData.append("body", textInput.current!.value);
    }

    if (hasImage) {
      formData.append("image", hasImage);
    }

    mutate(formData);
  }

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const path = URL.createObjectURL(file);
      setIsUploaded(path);
    }
  }

  function removeImage() {
    setIsUploaded("");
    if (imgInput.current) {
      imgInput.current.value = "";
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-md shadow-slate-200/60 p-4 sm:p-5">
      <textarea
        ref={textInput}
        rows={4}
        placeholder="What's on your mind?"
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white transition text-[15px]"
      />

      {isUploaded && (
        <div className="relative mt-3">
          <img
            src={isUploaded}
            alt="preview"
            className="w-full max-h-96 object-cover rounded-xl border border-slate-100"
          />
          <IoCloseCircleSharp
            onClick={removeImage}
            className="absolute top-[10px] end-[10px] size-8 text-white drop-shadow-lg cursor-pointer hover:scale-110 hover:text-red-100 transition"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
        <label
          htmlFor="post-image"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <FiImage className="w-5 h-5" />
          <span className="text-sm font-semibold">Add image</span>
          <input
            ref={imgInput}
            id="post-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePreview}
          />
        </label>

        <button
          disabled={isPending}
          onClick={handleCreatePost}
          type="button"
          className="disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 min-w-36 rounded-full shadow-md shadow-blue-600/30 hover:shadow-lg active:scale-95 cursor-pointer transition-all"
        >
          {isPending ? (
            <ImSpinner11 className="animate-spin" />
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Create Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}
