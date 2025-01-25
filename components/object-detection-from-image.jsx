"use client";

import React, { useRef, useState } from "react";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetectionFromImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL);
    }
  };

  const runObjectDetection = async () => {
    if (!imageRef.current) return;

    setIsLoading(true);

    const net = await cocoSSDLoad();

    // Set canvas dimensions to match the image
    canvasRef.current.width = imageRef.current.width;
    canvasRef.current.height = imageRef.current.height;

    // Detect objects in the image
    const detectedObjects = await net.detect(imageRef.current);

    console.log(detectedObjects)

    const context = canvasRef.current.getContext("2d");
    renderPredictions(detectedObjects, context);

    setIsLoading(false);
  };

  return (
    <div className="mt-8">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {imageUrl && (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Uploaded"
            className="rounded-md w-full lg:h-auto"
            onLoad={runObjectDetection} // Run detection once the image loads
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-auto"
          />
        </div>
      )}
      {isLoading && <div className="gradient-text">Detecting Objects...</div>}
    </div>
  );
};

export default ObjectDetectionFromImage;
