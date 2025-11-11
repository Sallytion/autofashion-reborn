import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import tshirticon from "@/assets/tshirt.png";
import hoodieicon from "@/assets/hoodie.png";

export function ModelSelector({ selectedModel, onModelChange }) {
  const models = [
    { id: 0, name: "T-Shirt", icon: tshirticon },
    { id: 1, name: "Hoodie", icon: hoodieicon },
  ];

  return (
    <div className="w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Select Apparel</h2>
      <div className="grid grid-cols-2 gap-4">
        {models.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:ring-1 hover:ring-gray-300"
            }`}
            onClick={() => onModelChange(model.id)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
              <img
                src={model.icon}
                alt={model.name}
                className="w-20 h-20 object-contain"
              />
              <span className="text-sm font-medium">{model.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
