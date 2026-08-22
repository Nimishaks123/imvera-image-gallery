import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ImageCard } from "./ImageCard.tsx";
import type { Image } from "../../types/image.ts";

interface ImageGridProps {
  images: Image[];
  selectedIds?: Set<string>;
  onSelect?: (id: string, checked: boolean) => void;
  onEdit?: (image: Image) => void;
  onDelete?: (image: Image) => void;
}

export function ImageGrid({
  images,
  selectedIds = new Set(),
  onSelect,
  onEdit,
  onDelete,
}: ImageGridProps) {
  return (
    <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isSelected={selectedIds.has(image.id)}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </SortableContext>
  );
}
