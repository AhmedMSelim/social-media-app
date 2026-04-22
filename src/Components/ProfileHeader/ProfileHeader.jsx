import { FiCamera, FiUsers, FiMail, FiMaximize2 } from "react-icons/fi";
import { useUploadPhoto } from "../Hooks/useUploadPhoto";
import { useRef } from "react";
import { useState } from "react";
import ImageCropModal from "../ImageCropModal/ImageCropModal";
import AboutCard from "../AboutCard/AboutCard";
import StatsCards from "../StatsCards/StatsCards";
import ProfileStatsFollowers from "../ProfileStatsFollowers/ProfileStatsFollowers";

export default function ProfileHeader({ user, saved = [], posts = [] }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [type, setType] = useState(null); // profile | cover
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { mutate } = useUploadPhoto();

  const profileRef = useRef(null);
  const coverRef = useRef(null);

  const handleUpload = (file, type) => {
    if (!file) return;

    const formData = new FormData();

    if (type === "profile") {
      formData.append("photo", file);
    }

    if (type === "cover") {
      formData.append("coverPhoto", file);
    }

    setIsUploading(true);

    mutate(formData, {
      onSuccess: () => {
        setIsUploading(false);
      },
      onError: () => {
        setIsUploading(false);
      },
    });
  };
  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-52 bg-gradient-to-r from-slate-900 to-blue-400">
          <label className="absolute right-3 top-3 flex items-center gap-1 bg-black/50 text-white px-3 py-1 rounded-lg text-xs cursor-pointer">
            <FiCamera size={14} />
            Add cover
            <input
              type="file"
              className="hidden"
              ref={coverRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setSelectedFile(file);
                setSelectedImage(URL.createObjectURL(file));
                setType("cover");
                setShowCrop(true);
              }}
            />
          </label>
        </div>

        <div className="relative -mt-16 p-5">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={user?.photo}
                    className="w-28 h-28 rounded-full border-4 border-white"
                  />

                  {isUploading && type === "profile" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  <button
                    onClick={() => setPreviewImage(user?.photo)}
                    className="absolute bottom-1 left-1 bg-white p-2 rounded-full shadow"
                  >
                    <FiMaximize2 size={14} />
                  </button>

                  <label className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                    <FiCamera size={14} />
                    <input
                      type="file"
                      className="hidden"
                      ref={profileRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setSelectedFile(file);
                        setSelectedImage(URL.createObjectURL(file));
                        setType("profile");
                        setShowCrop(true);
                      }}
                    />
                  </label>
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-gray-500">@{user?.username}</p>

                  <div className="mt-2 flex items-center gap-1 text-blue-600 text-sm">
                    <FiUsers size={14} />
                    Route Posts member
                  </div>
                </div>
              </div>

              <ProfileStatsFollowers user={user} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
              {" "}
              <AboutCard user={user} />
              <StatsCards
                className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3 transition hover:shadow-sm"
                postsCount={posts.length}
                savedCount={saved.length}
              />
            </div>
          </div>
        </div>
      </section>
      {showCrop && (
        <ImageCropModal
          image={selectedImage}
          onClose={() => setShowCrop(false)}
          onSave={() => {
            handleUpload(selectedFile, type);
            setShowCrop(false);
          }}
        />
      )}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
