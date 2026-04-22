import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";

import PostCard from "../PostCard/PostCard";
import PostCreation from "../PostCreation/PostCreation";
import Sidebar from "../Sidebar/Sidebar";
import MobileTabs from "../Sidebar/MobileTabs";
import PostSkeleton from "../PostSkeleton/PostSkeleton";

import { jwtDecode } from "jwt-decode";
import SuggestedFriends from "./../SuggestedFriends/SuggestedFriends";
export default function Home() {
  const [activeTab, setActiveTab] = useState("feed");
  const observer = useRef();

  const token = localStorage.getItem("userToken");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.user;

  // ================= POSTS =================
  const getPosts = async ({ pageParam = 1 }) => {
    try {
      const params = {
        sort: "-createdAt",
        page: pageParam,
      };

      if (activeTab !== "community") {
        params.user = userId;
      }

      const res = await axios.get("https://route-posts.routemisr.com/posts", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 👇 هنا تحطه
      console.log("FULL RESPONSE:", res);

      const posts = res?.data?.data?.posts ?? [];

      return {
        posts,
        nextPage: posts.length > 0 ? pageParam + 1 : undefined,
      };
    } catch (err) {
      console.log("API ERROR:", err);
      return { posts: [], nextPage: undefined };
    }
  };
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", activeTab, userId],
    queryFn: getPosts,
    initialPageParam: 1,

    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,

    enabled: !!userId && !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const getSavedPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      "https://route-posts.routemisr.com/users/bookmarks",
      {
        params: { page: pageParam },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const posts = data?.data?.bookmarks ?? [];

    return {
      posts,
      nextPage: data?.meta?.nextPage ?? undefined,
    };
  };

  const {
    data: savedData,
    fetchNextPage: fetchSavedNext,
    hasNextPage: hasSavedNext,
    isFetchingNextPage: isFetchingSaved,
    isLoading: isSavedLoading,
  } = useInfiniteQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
    initialPageParam: 1,

    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,

    enabled: activeTab === "saved" && !!token,
  });

  const allPosts = data?.pages?.flatMap((page) => page?.posts ?? []) ?? [];

  const savedPosts =
    savedData?.pages?.flatMap((page) => page?.posts ?? []) ?? [];

  const displayPosts = activeTab === "saved" ? savedPosts : allPosts;

  const lastPostRef = useCallback(
    (node) => {
      if (isFetchingNextPage || isFetchingSaved) return;

      if (activeTab === "saved") {
        if (!hasSavedNext) return;
      } else {
        if (!hasNextPage) return;
      }

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "saved") {
            fetchSavedNext();
          } else {
            fetchNextPage();
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [
      isFetchingNextPage,
      isFetchingSaved,
      hasNextPage,
      hasSavedNext,
      activeTab,
      fetchNextPage,
      fetchSavedNext,
    ],
  );

  if (isError) return <h1>{error?.message || "Something went wrong"}</h1>;

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-0 sm:px-3 py-3.5">
        <main className="min-w-0">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <section className="space-y-4 w-full">
              <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              <PostCreation />

              {(activeTab === "saved" ? isSavedLoading : isLoading) && (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              )}

              {displayPosts
                .filter((post) => post && (post._id || post.id))
                .map((post, index, arr) => {
                  if (index === arr.length - 1) {
                    return (
                      <div ref={lastPostRef} key={post._id || post.id}>
                        <PostCard post={post} />
                      </div>
                    );
                  }

                  return <PostCard key={post._id || post.id} post={post} />;
                })}

              {(isFetchingNextPage || isFetchingSaved) && (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              )}

              {!isLoading &&
                activeTab === "saved" &&
                savedPosts.length === 0 && (
                  <p className="text-center text-slate-400 py-4">
                    No saved posts yet 📌
                  </p>
                )}

              {(activeTab === "saved"
                ? !hasSavedNext && savedPosts.length > 0
                : !hasNextPage && allPosts.length > 0) && (
                <p className="text-center text-slate-400 py-4">
                  You reached the end 🚀
                </p>
              )}
            </section>

            <SuggestedFriends />
          </div>
        </main>
      </div>
    </>
  );
}
