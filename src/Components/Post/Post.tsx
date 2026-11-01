import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import type { PostType } from "../../Types/Post.type";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import type { CommentType } from "../../Types/Comment.type";
import CommentCreation from "../CommentCreation/CommentCreation";
import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ImSpinner11 } from "react-icons/im";
import { toast } from "react-hot-toast";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import useBookMark from './../../Hooks/useBookmark';
export default function Post({ post, isPostDetails = false, }: {
  post: PostType;
  isPostDetails?: boolean;
}) {
  const { body, image, user, createdAt, topComment, _id, bookmarked } = post;
  const { photo, name, _id: userId } = user;
  // loginUserId → الـ ID بتاع الشخص اللي عامل Login دلوقتي (من الـ AuthContext).
  const { userId: loginUserId } = useContext(AuthContext);
  // query → عشان نقدر نعمل invalidateQueries بعد الحذف.
  const query = useQueryClient();
  // navigate → عشان نرجع للـ Home بعد ما نمسح البوست.
  const navigate = useNavigate();
  // isOpen → State بيتحكم في ظهور قائمة الـ Edit / Delete.
  const [isOpen, setisOpen] = useState(false);
  // بيحدد احنا في وضع التعديل ولا لا
  const [isEditing, setIsEditing] = useState(false);
  // بيحفظ النص اللي اليوزر بيستخدمه
  const [editBody, setEditBody] = useState(body);
  const [currentBody, setCurrentBody] = useState(body)
  const [editImage, setEditImage] = useState<File | null>(null);
  const { toggleBookmark, PendingBookmark } = useBookMark()
  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments"],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function handleUpdatePost() {
    const formData = new FormData();
    formData.append("body", editBody);
    if (editImage) {
      formData.append("image", editImage);
    }
    return axios.put(`https://route-posts.routemisr.com/posts/${_id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { isPending: isUpdating, mutate: updateMutate } = useMutation({
    mutationFn: handleUpdatePost,
    onSuccess: (res) => {
      toast.success(res.data.message || "Post updated");
      setCurrentBody(editBody)
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      setIsEditing(false);
      setisOpen(false);
      setEditImage(null);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: (res) => {
      toast.success(res.data.massage);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      navigate("/");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-4 bg-white rounded-2xl shadow-md shadow-slate-200/60 border border-slate-100">
        {/* Header */}
        <div className="flex justify-between gap-3 items-center p-4 sm:p-5 pb-3">
          <Link to={`/user/${post.user._id}`}>
            <div className="flex items-center gap-3">
              <img
                src={photo}
                className="w-12 h-12 rounded-full object-cover border-2 border-white ring-1 ring-slate-200 shadow-sm"
                alt=""
              />
              <div>
                <p className="font-bold text-slate-900 text-[15px] hover:text-blue-600 transition-colors">{name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{createdAt}</p>
              </div>
            </div>
          </Link>

          <div className="relative">
            {loginUserId === userId && (
              <HiDotsVertical
                onClick={() => setisOpen(!isOpen)}
                className="w-9 h-9 p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer transition-colors"
              />
            )}

            {isOpen && (
              <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 absolute top-full mt-2 end-0 z-20 w-36">
                <ul className="flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setisOpen(false);
                        setEditBody(body);
                        setEditImage(null);
                      }}
                      className="flex gap-2 justify-center w-full items-center cursor-pointer text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed"
                    >
                      Edit <MdModeEdit />
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => mutate()}
                      disabled={isPending}
                      className="flex gap-2 justify-center w-full items-center cursor-pointer text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-lg transition-colors disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <ImSpinner11 className="animate-spin" />
                      ) : (
                        <>
                          Delete <MdDelete />
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-5 pb-4">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 focus:bg-white transition"
                rows={4}
              />
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditImage(e.target.files[0]);
                  }
                }}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2 text-sm text-slate-600 file:mr-3 file:px-4 file:py-1.5 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditBody(currentBody);
                  }}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>



                <button
                  onClick={() => {
                    if (!editBody.trim()) {
                      toast.error("اكتب نص للبوست الأول عشان تقدر تعدّل");
                      return;
                    }
                    updateMutate();
                  }}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-sm font-semibold shadow-md shadow-blue-600/30 active:scale-95 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                  {isUpdating ? "Saving..." : "Save"}
                </button>



              </div>
            </div>)
            :
            (
              <>
                <p className="mb-3 text-slate-800 leading-relaxed text-[15px] sm:text-base">
                  {currentBody}
                </p>
                {image && (
                  <img
                    src={image}
                    className="w-full max-h-[500px] object-cover rounded-xl border border-slate-100"
                    alt=""
                  />
                )}
              </>
            )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 border-t border-slate-100 p-1.5 sm:p-2">
          <div className="flex items-center justify-center gap-2 px-1 sm:px-3 py-2.5 rounded-xl cursor-pointer text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all font-semibold text-sm">
            <AiOutlineLike className="text-xl" />
            <span className="hidden sm:inline">Likes</span>
          </div>

          <Link to={`/postDetails/${_id}`} className="block">
            <div className="flex items-center justify-center gap-2 px-1 sm:px-3 py-2.5 rounded-xl cursor-pointer text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all font-semibold text-sm">
              <FaRegComment className="text-lg" />
              <span className="hidden sm:inline">Comments</span>
            </div>
          </Link>

          <div className="flex items-center justify-center gap-2 px-1 sm:px-3 py-2.5 rounded-xl cursor-pointer text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all font-semibold text-sm">
            <FaShare className="text-lg" />
            <span className="hidden sm:inline">Share</span>
          </div>

          <button
            onClick={() => toggleBookmark(_id)}
            disabled={PendingBookmark}
            className="flex items-center justify-center gap-2 px-1 sm:px-3 py-2.5 rounded-xl cursor-pointer text-slate-600 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all font-semibold text-sm disabled:opacity-50"
          >
            {bookmarked ? (
              <FaBookmark className="text-lg text-blue-600" />
            ) : (
              <FaRegBookmark className="text-lg" />
            )}
            <span className="hidden sm:inline">{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>

        <CommentCreation
          postId={_id}
          queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
        />

        {/* Top Comment */}
        <div>{topComment && <Comment comment={topComment} postId={_id} />}</div>

        {/* all Comments */}

        {isPostDetails &&
          data?.data.data.comments &&
          data?.data.data.comments.map((comment: CommentType) => (
            <Comment key={comment._id} comment={comment} postId={_id} />
          ))}
      </div>
    </>
  );
}