import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadCakeReferenceImage } from "../../services/customCakeService";
import { cn } from "../../utils/cn";
import { FieldLabel } from "./FormFields";

const MAX_MB = 5;

/**
 * Image uploader used on Step 6. Delegates the actual upload to the
 * service layer so it's Laravel-swap-ready.
 */
export const ImageUploader = ({ id = "reference-image", value, onChange, label = "Upload Inspiration Image" }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files) => {
    const file = files && files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image is larger than ${MAX_MB}MB. Please pick a smaller one.`);
      return;
    }
    setBusy(true);
    try {
      const uploaded = await uploadCakeReferenceImage(file);
      onChange(uploaded);
      toast.success("Reference image added.");
    } catch (err) {
      toast.error("Couldn't attach the image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const clear = () => onChange(null);

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      {value?.url ? (
        <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-brand-bg">
          <img src={value.url} alt="Reference" className="max-h-64 w-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-brand-dark shadow-sm transition-colors hover:text-brand-accent"
            aria-label="Remove image"
            data-testid={`${id}-clear`}
          >
            <X size={14} />
          </button>
          <p className="truncate px-4 py-2 text-xs text-brand-text">{value.filename || "reference.jpg"}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-line bg-brand-bg px-6 py-8 text-brand-text transition-colors hover:border-brand-accent hover:text-brand-accent",
            busy && "opacity-60",
          )}
          data-testid={`${id}-picker`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-secondary text-brand-accent">
            {busy ? <ImageIcon size={18} /> : <Upload size={18} />}
          </span>
          <p className="text-sm font-semibold text-brand-dark">
            {busy ? "Uploading…" : "Click to upload"}
          </p>
          <p className="text-[11px]">PNG, JPG, WEBP · up to {MAX_MB}MB</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        data-testid={`${id}-input`}
      />
    </div>
  );
};

export default ImageUploader;
