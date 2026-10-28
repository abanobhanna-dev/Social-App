import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useFollow from "../../Hooks/useFollow";
import { FaCalendarAlt } from "react-icons/fa";
import type { UserType } from "../../Types/ProfileUser.type";
import Post from './../../Components/Post/Post';
import type { PostType } from "../../Types/Post.type";
export default function UserProfile() {
    const { userId } = useParams();
    const { followUser, isPending } = useFollow();

    function getUserProfile() {
        return axios.get(
            `https://route-posts.routemisr.com/users/${userId}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            },
        );
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["getUserProfile", userId],
        queryFn: getUserProfile,
        enabled: !!userId,
    });
    function getUserPosts() {
        return axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            }
        })
    }
    const { data: postsData } = useQuery({
        queryKey: ["getUserPosts", userId],
        queryFn: getUserPosts,
        enabled: !!userId && !isLoading && !isError,
    })

    const user: UserType = data?.data.data.user;
    const isFollowing = data?.data.data.isFollowing;

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }
    if (isError) {
        return (
            <div className="text-center py-10 text-red-500">
                Error loading profile
            </div>
        );
    }

    return (
        <>
            {user && (
                <div className="w-full max-w-4xl mx-auto mt-6 bg-white rounded-3xl shadow-lg shadow-slate-200/60 overflow-hidden border border-slate-100">
                    {/* Header */}
                    <div className="bg-gradient-to-b from-blue-50 to-white px-5 sm:px-8 pt-8 pb-6">
                        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-5">
                            {/* Avatar */}
                            <img
                                src={user?.photo}
                                alt={user?.username}
                                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-slate-200 bg-slate-100 shrink-0"
                            />

                            {/* Name + Follow Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {user?.username}
                                    </h1>
                                    <p className="text-blue-600 font-medium text-sm mt-0.5">
                                        @{user?.username?.toLowerCase()}
                                    </p>
                                </div>

                                {/* زر الـ Follow */}
                                <button
                                    onClick={() => followUser(userId!)}
                                    disabled={isPending}
                                    className={`px-7 py-2.5 rounded-full font-semibold shadow-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isFollowing
                                        ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                                        }`}
                                >
                                    {isPending ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
                                </button>
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
            {postsData?.data.data.posts?.map((currentPost: PostType) => (
                <Post key={currentPost._id} post={currentPost} />
            ))}
        </>
    );
}