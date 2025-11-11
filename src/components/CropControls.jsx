import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Crop } from "lucide-react";

export function CropControls({
  cropTop,
  cropBottom,
  cropLeft,
  cropRight,
  onCropChange,
  disabled,
}) {
  if (disabled) {
    return (
      <Card className="w-full max-w-md opacity-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Crop className="w-5 h-5" />
            <p className="text-sm">Upload an image to enable cropping</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display as percentage for better UX
  const toPercent = (val) => Math.round(val * 100);

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crop className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Crop Design</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="crop-top" className="text-sm font-medium">
                Top
              </Label>
              <span className="text-xs text-gray-500">{toPercent(cropTop)}%</span>
            </div>
            <Slider
              id="crop-top"
              min={0}
              max={0.9}
              step={0.01}
              value={[cropTop]}
              onValueChange={(value) => onCropChange("top", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="crop-bottom" className="text-sm font-medium">
                Bottom
              </Label>
              <span className="text-xs text-gray-500">{toPercent(cropBottom)}%</span>
            </div>
            <Slider
              id="crop-bottom"
              min={0}
              max={0.9}
              step={0.01}
              value={[cropBottom]}
              onValueChange={(value) => onCropChange("bottom", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="crop-left" className="text-sm font-medium">
                Left
              </Label>
              <span className="text-xs text-gray-500">{toPercent(cropLeft)}%</span>
            </div>
            <Slider
              id="crop-left"
              min={0}
              max={0.9}
              step={0.01}
              value={[cropLeft]}
              onValueChange={(value) => onCropChange("left", value[0])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="crop-right" className="text-sm font-medium">
                Right
              </Label>
              <span className="text-xs text-gray-500">{toPercent(cropRight)}%</span>
            </div>
            <Slider
              id="crop-right"
              min={0}
              max={0.9}
              step={0.01}
              value={[cropRight]}
              onValueChange={(value) => onCropChange("right", value[0])}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
