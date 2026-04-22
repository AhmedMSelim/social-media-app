import { MdClose } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirm action",
  message = "Are you sure?",
  confirmText = "Confirm",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-base font-extrabold text-slate-900">{title}</h4>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <MdClose size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex items-start gap-3 p-4">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <FiAlertTriangle size={18} />
          </div>

          <div>
            <h5 className="text-sm font-extrabold text-slate-900">{message}</h5>
            <p className="mt-1 text-sm text-slate-600">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm font-bold hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
