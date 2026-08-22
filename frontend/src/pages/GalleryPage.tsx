import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { useAuth } from "../hooks/useAuth.ts";
import {
  fetchImages,
  uploadImages,
  updateImage,
  deleteImage,
  saveImageOrder,
  setLocalImagesOrder,
  clearImageError,
} from "../store/slices/imageSlice.ts";
import type { Image } from "../types/image.ts";

import { Button } from "../components/common/Button.tsx";
import { Spinner } from "../components/common/Spinner.tsx";
import { Modal } from "../components/common/Modal.tsx";
import { FormField } from "../components/common/FormField.tsx";
import { EmptyState } from "../components/gallery/EmptyState.tsx";
import { ImageGrid } from "../components/gallery/ImageGrid.tsx";

interface SelectedFileItem {
  id: string;
  file: File;
  title: string;
  previewUrl: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function GalleryPage() {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { images, isLoading, error } = useAppSelector((state) => state.image);

  // Reorder state
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [deletingImage, setDeletingImage] = useState<Image | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Form states for Upload
  const [uploadFiles, setUploadFiles] = useState<SelectedFileItem[]>([]);

  // Form states for Edit
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Fetch images on mount
  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [uploadFiles]);

  useEffect(() => {
    if (editFilePreview) {
      return () => URL.revokeObjectURL(editFilePreview);
    }
  }, [editFilePreview]);

  // Handle Drag Reorder local update
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);
      dispatch(setLocalImagesOrder(reordered));
      setIsOrderChanged(true);
    }
  }

  // Save Order
  async function handleSaveOrder() {
    const imageIds = images.map((img) => img.id);
    const result = await dispatch(saveImageOrder(imageIds));
    if (saveImageOrder.fulfilled.match(result)) {
      setIsOrderChanged(false);
    }
  }

  // Discard Order changes
  function handleDiscardOrder() {
    dispatch(fetchImages());
    setIsOrderChanged(false);
  }

  // Select item toggle
  function handleSelect(id: string, checked: boolean) {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  }

  // Select all toggle
  function handleSelectAll() {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((img) => img.id)));
    }
  }

  // Clear states when closing modals
  function closeUploadModal() {
    setIsUploadOpen(false);
    uploadFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setUploadFiles([]);
    dispatch(clearImageError());
  }

  function openEditModal(image: Image) {
    setEditingImage(image);
    setEditTitle(image.title);
    setEditFile(null);
    setEditFilePreview(null);
    dispatch(clearImageError());
  }

  function closeEditModal() {
    setEditingImage(null);
    if (editFilePreview) URL.revokeObjectURL(editFilePreview);
    setEditFilePreview(null);
    dispatch(clearImageError());
  }

  function closeDeleteModal() {
    setDeletingImage(null);
    dispatch(clearImageError());
  }

  // Handle Bulk upload file selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file) => {
      // Default title as base filename
      const title = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        title,
        previewUrl: URL.createObjectURL(file),
      };
    });
    setUploadFiles((prev) => [...prev, ...newFiles]);
  }

  // Edit file replacement selection
  function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0]!;
    setEditFile(file);
    if (editFilePreview) URL.revokeObjectURL(editFilePreview);
    setEditFilePreview(URL.createObjectURL(file));
  }

  // Remove individual file from selection before upload
  function removeSelectedFile(id: string) {
    setUploadFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  }

  // Submit Bulk Upload
  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploadFiles.length === 0) return;

    const formData = new FormData();
    uploadFiles.forEach((item) => {
      formData.append("files", item.file);
      formData.append("titles", item.title);
    });

    const result = await dispatch(uploadImages(formData));
    if (uploadImages.fulfilled.match(result)) {
      closeUploadModal();
    }
  }

  // Submit Edit
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingImage) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    if (editFile) {
      formData.append("file", editFile);
    }

    const result = await dispatch(updateImage({ id: editingImage.id, formData }));
    if (updateImage.fulfilled.match(result)) {
      closeEditModal();
    }
  }

  // Submit Delete
  async function handleDeleteSubmit() {
    if (!deletingImage) return;
    const result = await dispatch(deleteImage(deletingImage.id));
    if (deleteImage.fulfilled.match(result)) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingImage.id);
        return next;
      });
      closeDeleteModal();
    }
  }

  // Submit Bulk Delete
  async function handleBulkDeleteSubmit() {
    setBulkDeleting(true);
    let successCount = 0;
    for (const id of Array.from(selectedIds)) {
      const result = await dispatch(deleteImage(id));
      if (deleteImage.fulfilled.match(result)) {
        successCount++;
      }
    }
    setSelectedIds(new Set());
    setBulkDeleting(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Imvera
          </span>
        </div>

        {/* Right Nav profile options */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 shrink-0"
                aria-hidden="true"
              >
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user.name}
              </span>
            </div>
          )}
          <Button id="logout-btn" variant="ghost" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Images</h2>
            <p className="text-sm text-slate-500 mt-1">Upload, drag-and-drop sort, and edit your photos</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {images.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleSelectAll}
                className="bg-white border-slate-300 text-slate-700 text-xs"
              >
                {selectedIds.size === images.length ? "Deselect All" : "Select All"}
              </Button>
            )}

            {selectedIds.size > 0 && (
              <Button
                onClick={handleBulkDeleteSubmit}
                isLoading={bulkDeleting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs border-none"
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}

            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm text-xs"
            >
              Upload Images
            </Button>
          </div>
        </div>

        {/* Local Reorder Floating Banner */}
        {isOrderChanged && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-4 animate-fade-in shadow-sm">
            <span className="text-sm font-medium text-blue-800">
              Unsaved changes: Drag positions modified. Save to lock them in.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleDiscardOrder}
                className="bg-white border-slate-300 text-slate-700 py-1.5 px-3.5 text-xs hover:bg-slate-100"
              >
                Discard
              </Button>
              <Button
                onClick={handleSaveOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3.5 text-xs border-none shadow-sm"
              >
                Save Order
              </Button>
            </div>
          </div>
        )}

        {/* Global state loading spinner */}
        {isLoading && images.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : images.length === 0 ? (
          <EmptyState
            title="No images yet"
            description="Upload your first photo to get started with Imvera. Supported formats: JPEG, PNG, WebP, GIF."
            actionText="Upload Images"
            onUploadClick={() => setIsUploadOpen(true)}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ImageGrid
              images={images}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onEdit={openEditModal}
              onDelete={setDeletingImage}
            />
          </DndContext>
        )}
      </main>

      {/* Bulk Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={closeUploadModal} title="Upload Images">
        <form onSubmit={handleUploadSubmit} className="flex flex-col gap-5">
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 text-center relative cursor-pointer hover:bg-slate-100/50 transition-all">
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp, image/gif"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400 mx-auto mb-2"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              <polyline points="16 16 12 12 8 16" />
            </svg>
            <p className="text-xs font-semibold text-slate-700">Choose images to upload</p>
            <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WebP, or GIF up to 10MB</p>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {uploadFiles.length > 0 && (
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Files Selected ({uploadFiles.length})
              </p>
              {uploadFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm relative group items-center"
                >
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded object-cover border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        setUploadFiles((prev) =>
                          prev.map((f) => (f.id === item.id ? { ...f, title: e.target.value } : f)),
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Enter image title"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 mt-2">
            <Button
              variant="ghost"
              onClick={closeUploadModal}
              disabled={isLoading}
              className="py-2 px-4 text-xs bg-white text-slate-700 border border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={uploadFiles.length === 0}
              className="py-2 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
            >
              Upload
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingImage} onClose={closeEditModal} title="Edit Image">
        {editingImage && (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center mb-2">
              <img
                src={editFilePreview || editingImage.url}
                alt="Preview"
                className="w-20 h-20 rounded border border-slate-200 object-cover bg-slate-50"
              />
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Replace Image File (Optional)
                </label>
                <div className="relative border border-slate-300 rounded px-3 py-2 bg-slate-50 text-center hover:bg-slate-100 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/gif"
                    onChange={handleEditFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-xs text-slate-600 font-semibold truncate block">
                    {editFile ? editFile.name : "Choose file"}
                  </span>
                </div>
              </div>
            </div>

            <FormField
              id="edit-image-title"
              label="Image Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter image title"
              required
            />

            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4 mt-3">
              <Button
                variant="ghost"
                onClick={closeEditModal}
                disabled={isLoading}
                className="py-2 px-4 text-xs bg-white text-slate-700 border border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!editTitle.trim()}
                className="py-2 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingImage} onClose={closeDeleteModal} title="Confirm Deletion">
        {deletingImage && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <img
                src={deletingImage.url}
                alt={deletingImage.title}
                className="w-16 h-16 rounded border border-slate-100 object-cover bg-slate-100"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {deletingImage.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Added {new Date(deletingImage.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete this image? This action will permanently remove the file from storage and cannot be undone.
            </p>

            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              <Button
                variant="ghost"
                onClick={closeDeleteModal}
                disabled={isLoading}
                className="py-2 px-4 text-xs bg-white text-slate-700 border border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSubmit}
                isLoading={isLoading}
                className="py-2 px-4 text-xs bg-red-600 hover:bg-red-700 text-white border-none shadow-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default GalleryPage;
