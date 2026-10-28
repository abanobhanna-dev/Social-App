import { FaCamera, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import type { UserType } from "../../Types/ProfileUser.type";
import Post from "../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";
import { useRef } from 'react';

export default function Profile() {
  // useRef
  const fileInputRef = useRef<HTMLInputElement>(null);
  // React Query Client
  const queryClient = useQueryClient();
  // Mutation Upload Image Profile
  const { mutate: uploadPhoto, isPending } = useMutation({
    mutationFn: (photo: File) => {
      const formData = new FormData();
      formData.append("photo", photo);

      return axios.put(
        `https://route-posts.routemisr.com/users/upload-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });
  // Open the image selection window
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  }
  // دالة بتشتغل لما المستخدم يختار صورة من الجهاز
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  }
  // Fetch profile data
  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }

  // Query to fetch profile data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile
  })
  const user: UserType = data?.data.data.user

  // function that retrieves all posts belonging to a user
  function getMyPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${user._id}/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }
  // Query to retrieve user posts (will only work after profile data is received)
  const { data: PostUserData } = useQuery({
    queryKey: ["getUserPosts"],
    queryFn: getMyPosts,
    enabled: !isLoading && !isError && !!data
  })
  console.log(data?.data)
  return (
    <>
      {user && (
        <div className="w-full max-w-4xl mx-auto mt-6 bg-white rounded-3xl shadow-lg shadow-slate-200/60 overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-b from-blue-50 to-white px-5 sm:px-8 pt-8 pb-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user?.photo}
                  alt={user?.username}
                  className={`w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-slate-200 bg-slate-100 ${isPending ? "opacity-60 animate-pulse" : ""}`}
                />
                {/* Camera badge */}
                <button
                  onClick={handleCameraClick}
                  disabled={isPending}
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg border-2 border-white transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                  <FaCamera className="w-4 h-4 text-white" />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>

              {/* Name + Username */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{user?.username}</h1>
                <p className="text-blue-600 font-medium text-sm mt-0.5">@{user?.username?.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-5 sm:px-8 pb-8">
            {/* Gender + Joined */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <FaUser className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize">{user?.gender}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <FaCalendarAlt className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Joined{" "}
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 mt-8 rounded-2xl bg-slate-50 border border-slate-100 divide-x divide-slate-200 overflow-hidden">
              <div className="text-center py-4 hover:bg-white transition">
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user?.followersCount || 0}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Followers</p>
              </div>

              <div className="text-center py-4 hover:bg-white transition">
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user?.followingCount || 0}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Following</p>
              </div>

              <div className="text-center py-4 hover:bg-white transition">
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user?.bookmarksCount || 0}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Bookmarks</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {PostUserData?.data.data.posts.map((currentPost: PostType) => <Post key={currentPost._id} post={currentPost} />)}
    </>
  )
}