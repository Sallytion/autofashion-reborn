import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CirclePicker } from "react-color";
import { Palette } from "lucide-react";

export function ColorPicker({ color, onColorChange }) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Choose Color</h2>
        </div>
        <div className="flex justify-center">
          <CirclePicker
            color={color}
            onChangeComplete={(colorEvent) => onColorChange(colorEvent.hex)}
            colors={[
              "#f44336",
              "#e91e63",
              "#9c27b0",
              "#673ab7",
              "#3f51b5",
              "#2196f3",
              "#03a9f4",
              "#00bcd4",
              "#009688",
              "#4caf50",
              "#8bc34a",
              "#cddc39",
              "#ffeb3b",
              "#ffc107",
              "#ff9800",
              "#ff5722",
              "#795548",
              "#607d8b",
              "#000000",
              "#ffffff",
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
