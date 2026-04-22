import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import Loader from "../Loader/Loader";
import PostCard from "../PostCard/PostCard";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePosts", id],
    queryFn: getPostDetails,
    staleTime: 1000 * 50,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;
  if (isError) return <h1>{error.message}</h1>;

  const post = data?.data?.data?.post;

  return (
    <div className="mx-auto w-full max-w-3xl px-0 sm:px-3 py-3 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <PostCard post={post} isPostDetails={true} />
    </div>
  );
}
