import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

export function PositionControls({ onMove, onReset, disabled }) {
  const buttonSize = "h-10 w-10";

  if (disabled) {
    return (
      <Card className="w-full max-w-md opacity-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Move className="w-5 h-5" />
            <p className="text-sm">Upload an image to enable positioning</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Position Design</h2>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            className={buttonSize}
            onClick={() => onMove("up")}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={buttonSize}
              onClick={() => onMove("left")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="w-10 h-10 border-2 border-dashed rounded flex items-center justify-center">
              <Move className="w-5 h-5 text-gray-400" />
            </div>

            <Button
              variant="outline"
              className={buttonSize}
              onClick={() => onMove("right")}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <Button
            variant="outline"
            className={buttonSize}
            onClick={() => onMove("down")}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can also use arrow keys on your keyboard
        </p>
      </CardContent>
    </Card>
  );
}
