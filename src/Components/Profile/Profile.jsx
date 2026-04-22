import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfilePosts from "../ProfilePosts/ProfilePosts";
import { useParams } from "react-router-dom";

const getMyProfile = async () => {
  const token = localStorage.getItem("userToken");

  const { data } = await axios.get(
    "https://route-posts.routemisr.com/users/profile-data",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const getUserPosts = async (userId) => {
  const token = localStorage.getItem("userToken");

  const { data } = await axios.get(
    `https://route-posts.routemisr.com/users/${userId}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const getSavedPosts = async () => {
  const token = localStorage.getItem("userToken");

  const { data } = await axios.get(
    "https://route-posts.routemisr.com/users/bookmarks",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

export default function Profile() {
  const { id } = useParams();
  const [tab, setTab] = useState("posts");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const user = data?.data?.user || {};

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: () => getUserPosts(user._id),
    enabled: !!user?._id,
  });

  const { data: savedData, isLoading: savedLoading } = useQuery({
    queryKey: ["profileSavedPosts"],
    queryFn: getSavedPosts,
  });

  const posts = postsData?.data?.posts || [];
  const saved = savedData?.data?.bookmarks || [];

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading Profile ...</p>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader user={user} posts={posts} saved={saved} />

      <ProfilePosts
        user={user}
        posts={posts}
        saved={saved}
        tab={tab}
        setTab={setTab}
        isLoading={tab === "posts" ? postsLoading : savedLoading}
      />
    </>
  );
}
