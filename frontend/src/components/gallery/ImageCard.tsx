import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Image } from "../../types/image.ts";

interface ImageCardProps {
  image: Image;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onEdit?: (image: Image) => void;
  onDelete?: (image: Image) => void;
}

export function ImageCard({
  image,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: ImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "bg-white border rounded-lg overflow-hidden flex flex-col group relative transition-all duration-150 shadow-sm hover:shadow-md",
        isSelected ? "border-blue-500 ring-1 ring-blue-500/50" : "border-slate-200",
        isDragging ? "opacity-30 z-20 scale-[1.01]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Selection Area Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect?.(image.id, e.target.checked)}
          className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          aria-label={`Select image ${image.title}`}
        />
      </div>

      {/* Drag handle grabber icon */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 z-10 p-1.5 rounded bg-white/90 border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        title="Drag to reorder"
        aria-label="Reorder handle"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>

      {/* Image Thumbnail */}
      <div className="aspect-[4/3] w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      {/* Card Details & Actions footer */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 truncate" title={image.title}>
            {image.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Added {new Date(image.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit & Delete Action Panel */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onEdit?.(image)}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3.5 rounded text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
            type="button"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(image)}
            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3.5 rounded text-xs font-semibold text-red-600 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default ImageCard;
