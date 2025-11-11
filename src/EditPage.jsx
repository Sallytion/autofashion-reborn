import React, { useEffect, useState, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshPhysicalMaterial } from "three";
import ArrowKeysReact from "arrow-keys-react";
import "./App.css";

// Model imports
import tshirtModel from "./assets/tshirt-base.glb";
import hoodieModel from "./assets/hoodie.glb";
import tShirtImage from "./assets/tshirtimagetest.glb";
import hoodieImage from "./assets/hoodie-Image.glb";

// Component imports
import { ModelSelector } from "@/components/ModelSelector";
import { ImageUploader } from "@/components/ImageUploader";
import { ColorPicker } from "@/components/ColorPicker";
import { CropControls } from "@/components/CropControls";
import { PositionControls } from "@/components/PositionControls";

const models = [tshirtModel, hoodieModel];
const overlayModels = [tShirtImage, hoodieImage];

models.forEach((model) => {
  useGLTF.preload(model);
});
overlayModels.forEach((model) => {
  useGLTF.preload(model);
});

// 3D Model Component - Base apparel model
function Model({ modelSelect, color, opacity }) {
  const { scene } = useGLTF(models[modelSelect]);

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new MeshPhysicalMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity,
      });
    }
  });

  return <primitive object={scene} />;
}

// 3D Model Component - Overlay for user uploaded design
function ModelImageFront({
  model,
  color,
  textureImage,
  textureOffset,
  cropTop,
  cropBottom,
  cropLeft,
  cropRight,
}) {
  const { scene } = useGLTF(model);
  const [texture, setTexture] = useState(null);

  // Load texture only when image changes
  useEffect(() => {
    if (!textureImage) return;
    
    const loader = new THREE.TextureLoader();
    const newTexture = loader.load(
      textureImage,
      // onLoad callback
      (loadedTexture) => {
        console.log("Texture loaded successfully", loadedTexture);
        loadedTexture.center = new THREE.Vector2(0.5, 0.5);
        loadedTexture.rotation = Math.PI;
        setTexture(loadedTexture);
      },
      // onProgress callback
      undefined,
      // onError callback
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  }, [textureImage]);

  useEffect(() => {
    if (!texture) return;

    console.log("Applying texture with crop values:", { cropTop, cropBottom, cropLeft, cropRight });

    // Calculate texture repeat and offset for actual image cropping
    // Crop values are normalized 0-1 where 0 = no crop, 1 = full crop
    const horizontalCrop = cropLeft + cropRight;
    const verticalCrop = cropTop + cropBottom;
    
    // Repeat makes the texture "zoom in" - higher values = more cropped
    const repeatX = 1 / Math.max(0.01, 1 - horizontalCrop);
    const repeatY = 1 / Math.max(0.01, 1 - verticalCrop);
    
    // Offset shifts which part of the texture is visible
    // This accounts for asymmetric cropping (more on one side)
    const offsetX = (cropLeft * repeatX) + textureOffset[1];
    const offsetY = (cropBottom * repeatY) + textureOffset[0];

    console.log("Texture settings:", { repeatX, repeatY, offsetX, offsetY });

    texture.repeat.set(repeatX, repeatY);
    texture.offset.set(offsetX, offsetY);
    texture.needsUpdate = true;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhysicalMaterial({
          color: color,
          metalness: 0.1,
          roughness: 0.8,
          side: THREE.DoubleSide,
          map: texture,
          transparent: false,
        });
        child.material.needsUpdate = true;
        console.log("Material updated for mesh:", child.name);
      }
    });
  }, [
    scene,
    texture,
    textureOffset,
    cropBottom,
    cropTop,
    cropRight,
    cropLeft,
    color,
  ]);

  return <primitive object={scene} />;
}

// Camera setup component
const CameraPosition = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 50;
  }, [camera]);

  return null;
};

// Main EditPage component
const EditPage = () => {
  // Model and appearance state
  const [modelSelect, setModelSelect] = useState(0);
  const [modelColor, setModelColor] = useState("#f44336");
  const [modelOpacity, setModelOpacity] = useState(1);

  // Image and design state
  const [userImage, setUserImage] = useState(null);
  const [textureOffset, setTextureOffset] = useState([0, 0]);

  // Crop state (normalized 0-1 values for texture cropping)
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);

  // Handle model change - reset image position when switching models
  const handleModelChange = useCallback((modelId) => {
    setModelSelect(modelId);
    setTextureOffset([0, 0]); // Reset position when changing models
  }, []);

  // Handle image upload
  const handleImageSelect = useCallback((imageData) => {
    setUserImage(imageData);
    if (imageData) {
      // Reset position and crop when new image is uploaded
      setTextureOffset([0, 0]);
      setCropTop(0);
      setCropBottom(0);
      setCropLeft(0);
      setCropRight(0);
    }
  }, []);

  // Handle crop changes
  const handleCropChange = useCallback((direction, value) => {
    switch (direction) {
      case "top":
        setCropTop(value);
        break;
      case "bottom":
        setCropBottom(value);
        break;
      case "left":
        setCropLeft(value);
        break;
      case "right":
        setCropRight(value);
        break;
      default:
        break;
    }
  }, []);

  // Handle position changes
  const handleMove = useCallback((direction) => {
    const step = 0.075;
    setTextureOffset((prev) => {
      switch (direction) {
        case "up":
          return [prev[0] + step, prev[1]];
        case "down":
          return [prev[0] - step, prev[1]];
        case "left":
          return [prev[0], prev[1] + step];
        case "right":
          return [prev[0], prev[1] - step];
        default:
          return prev;
      }
    });
  }, []);

  // Reset position
  const handleResetPosition = useCallback(() => {
    setTextureOffset([0, 0]);
  }, []);

  // Arrow key controls
  ArrowKeysReact.config({
    left: () => handleMove("left"),
    right: () => handleMove("right"),
    up: () => handleMove("up"),
    down: () => handleMove("down"),
  });

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* 3D Canvas Section */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200">
        <Canvas>
          <CameraPosition />
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <directionalLight position={[0, 10, 0]} intensity={1} />
          <hemisphereLight
            skyColor={"#87CEEB"}
            groundColor={"#8B7355"}
            intensity={0.3}
          />
          <Model
            modelSelect={modelSelect}
            color={modelColor}
            opacity={modelOpacity}
          />
          {userImage && (
            <ModelImageFront
              model={overlayModels[modelSelect]}
              color="#ffffff"
              textureImage={userImage}
              textureOffset={textureOffset}
              cropBottom={cropBottom}
              cropLeft={cropLeft}
              cropRight={cropRight}
              cropTop={cropTop}
            />
          )}
        </Canvas>
      </div>

      {/* Controls Section */}
      <div
        className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto p-6 bg-white"
        {...ArrowKeysReact.events}
        tabIndex={0}
      >
        <div className="max-w-2xl mx-auto pb-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              AutoFashion Reborn
            </h1>
            <p className="text-gray-600">
              Customize your apparel with your own design
            </p>
          </div>

          <div className="space-y-6">
            {/* Model Selection */}
            <ModelSelector
              selectedModel={modelSelect}
              onModelChange={handleModelChange}
            />

            {/* Color Selection */}
            <ColorPicker color={modelColor} onColorChange={setModelColor} />

            {/* Image Upload */}
            <ImageUploader
              onImageSelect={handleImageSelect}
              currentImage={userImage}
            />

            {/* Position Controls */}
            <PositionControls
              onMove={handleMove}
              onReset={handleResetPosition}
              disabled={!userImage}
            />

            {/* Crop Controls */}
            <CropControls
              cropTop={cropTop}
              cropBottom={cropBottom}
              cropLeft={cropLeft}
              cropRight={cropRight}
              onCropChange={handleCropChange}
              disabled={!userImage}
            />
            
            {userImage && (
              <div className="text-center text-sm text-gray-500 mt-4">
                💡 Scroll down to see all controls
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
