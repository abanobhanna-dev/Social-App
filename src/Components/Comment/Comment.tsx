import type { CommentType } from "../../Types/Comment.type";
import { HiDotsVertical } from "react-icons/hi";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImSpinner11 } from "react-icons/im";
import { toast } from 'react-hot-toast';
type CommentData = Pick<CommentType, "_id" | "content" | "commentCreator" | "createdAt"> & {
  image?: string;
};
export default function Comment({ comment, postId }: { comment: CommentData; postId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { content, commentCreator, createdAt } = comment;
  const { photo, name, _id: commentOwnerId } = commentCreator;
  const { userId: loginUserId } = useContext(AuthContext);
  const qyery = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [updatedContent, setUpdatedContent] = useState(content)
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);


  function handleUpdateComment() {
    const formData = new FormData();
    formData.append("content", updatedContent);
    if (updatedImage) {
      formData.append("image", updatedImage);
    }
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }

  function handleDeleteComment() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }

  const { isPending, mutate } = useMutation({
    mutationFn: handleDeleteComment,
    onSuccess: (res) => {
      toast.success(res.data.message)
      qyery.invalidateQueries({ queryKey: ["getPostComments"] })
      qyery.invalidateQueries({ queryKey: ["getAllPosts"] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const { isPending: isUpdating, mutate: updateComment } = useMutation({
    mutationFn: handleUpdateComment,
    onSuccess: (res) => {
      toast.success(res.data.message)
      setIsEditing(false)
      setUpdatedImage(null)
      qyery.invalidateQueries({ queryKey: ["getPostComments"] })
      qyery.invalidateQueries({ queryKey: ["getAllPosts"] })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  return (
    <div className="mx-4 mb-4 mt-1 bg-gray-200 rounded-xl p-3.5 border border-gray-100">
      <div className="flex gap-3 items-start">
        <img
          src={photo}
          className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{name}</p>
              <span className="text-xs text-gray-400">•</span>
              <p className="text-xs text-gray-500">{createdAt}</p>
            </div>

            <div className="relative m-4">
              {loginUserId === commentOwnerId && (
                <HiDotsVertical
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer shrink-0 font-bold text-2xl"
                />
              )}

              {isOpen && (
                <div className="bg-white p-2 rounded-lg absolute top-[120%] end-[-100px] shadow-2xl border border-slate-500">
                  <ul className="flex flex-col gap-3">



                    <li>
                      <button
                        onClick={() => {
                          setUpdatedContent(content)
                          setIsEditing(true)
                          setIsOpen(false)
                        }}
                        className="flex gap-2 items-center cursor-pointer bg-slate-400 p-2"
                      >
                        Edit <FaPen />
                      </button>
                    </li>



                    <li>
                      <button
                        disabled={isPending}
                        onClick={() => mutate()}
                        className="flex gap-2 justify-center w-full
                        disabled:bg-slate-900 disabled-not-allowed
                        disabled:text-white  items-center cursor-pointer
                        bg-slate-400 p-2">
                        {isPending ? <ImSpinner11 className="animate-spin" /> : <>Delete <FaTrashAlt /></>}
                      </button>

                    </li>
                  </ul>
                </div>
              )}
            </div>


          </div>


          {isEditing ? (
            <div className="mt-3 space-y-3">
              <textarea
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
                className="w-full border rounded-lg p-3"
                placeholder="Edit your comment..."
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setUpdatedImage(e.target.files?.[0] ?? null)
                }
                className="w-full"
              />

              <div className="flex gap-2">
                <button
                  disabled={isUpdating}
                  onClick={() => updateComment()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>

                <button
                  disabled={isUpdating}
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedContent(content);
                    setUpdatedImage(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) :
            (
              <p className="text-gray-700 text-sm leading-relaxed">
                {content}
              </p>
            )}

          {comment?.image &&
            (
              <img src={comment.image} className="mt-2 w-full max-h-[300px] object-cover rounded-lg" alt="" />
            )
          }
        </div>
      </div>
    </div>
  );
}