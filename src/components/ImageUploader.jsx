import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function ImageUploader({ onImageSelect, currentImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Upload Design</h2>
      
      {!previewUrl ? (
        <Card
          className={`cursor-pointer transition-all ${
            isDragging
              ? "border-primary border-2 bg-primary/5"
              : "border-dashed border-2 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <Upload className="w-12 h-12 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drop your image here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-48 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change Image
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
