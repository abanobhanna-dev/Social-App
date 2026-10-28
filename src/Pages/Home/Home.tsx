import axios from "axios";
import type { PostType } from "../../Types/Post.type";
import Post from "./../../Components/Post/Post";
import Loader from "../../Components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreaction from './../../Components/PostCreaction/PostCreaction';
export default function Home() {
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts?sort=-createdAt`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllPosts"], // request name
    queryFn: getAllPosts, // call Api
    retry: 3,
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-start justify-center pt-16 px-4">
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm px-6 py-5 text-center max-w-sm w-full">
          <p className="font-semibold text-red-600">Something went wrong</p>
          <p className="text-sm text-red-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 py-6">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 flex flex-col gap-4">
          <PostCreaction />

          {data?.data.data.posts.map((post: PostType) => (
            <Post post={post} key={post.id} isPostDetails={false} />
          ))}
        </div>
      </div>
    </>
  );
}