import { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropModal({ image, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[350px] rounded-2xl bg-white p-4">
        <h2 className="text-lg font-bold mb-2">Adjust profile photo</h2>

        <div className="relative h-[300px] w-full bg-slate-200 rounded-xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          className="w-full mt-3"
        />

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
            Cancel
          </button>

          <button
            onClick={() => onSave(image)}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
