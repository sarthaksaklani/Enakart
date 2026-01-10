// src/components/products/VirtualTryOn.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Download, RotateCcw, Loader2 } from 'lucide-react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  glassesImage: string;
  productName: string;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  isOpen,
  onClose,
  glassesImage,
  productName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const detectorRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const glassesImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;

    const initializeCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load face detection model
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'tfjs' as const,
          refineLandmarks: true,
        };

        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
        detectorRef.current = detector;

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!mounted || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        await videoRef.current.play();

        // Preload glasses image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = glassesImage;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });
        glassesImgRef.current = img;

        // Start rendering
        const renderFrame = async () => {
          if (!mounted || !videoRef.current || !canvasRef.current || !detectorRef.current || !glassesImgRef.current) {
            return;
          }

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          if (!ctx) return;

          // Set canvas size
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          // Clear and draw video (mirrored)
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
          ctx.restore();

          // Detect faces
          try {
            const faces = await detectorRef.current.estimateFaces(video, {
              flipHorizontal: false,
            });

            if (faces && faces.length > 0) {
              const face = faces[0];
              const keypoints = face.keypoints;

              // Get key landmarks
              // Left eye: 33
              // Right eye: 263
              // Nose tip: 1
              const leftEye = keypoints.find((kp: any) => kp.name === 'leftEye' || kp.x && kp.y);
              const rightEye = keypoints.find((kp: any) => kp.name === 'rightEye');

              // Fallback to index-based if names don't exist
              const leftEyePoint = keypoints[33] || leftEye;
              const rightEyePoint = keypoints[263] || rightEye;
              const noseTip = keypoints[1];

              if (leftEyePoint && rightEyePoint) {
                // Mirror coordinates for display
                const leftX = canvas.width - leftEyePoint.x;
                const leftY = leftEyePoint.y;
                const rightX = canvas.width - rightEyePoint.x;
                const rightY = rightEyePoint.y;

                // Calculate glasses dimensions
                const eyeDistance = Math.sqrt(
                  Math.pow(rightX - leftX, 2) + Math.pow(rightY - leftY, 2)
                );

                const glassesWidth = eyeDistance * 2.5;
                const glassesHeight = glassesWidth * 0.35;

                // Calculate center position
                const centerX = (leftX + rightX) / 2;
                const centerY = (leftY + rightY) / 2 - glassesHeight * 0.15;

                // Calculate rotation angle
                const angle = Math.atan2(rightY - leftY, rightX - leftX);

                // Draw glasses
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle);
                ctx.globalAlpha = 0.95;
                ctx.drawImage(
                  glassesImgRef.current,
                  -glassesWidth / 2,
                  -glassesHeight / 2,
                  glassesWidth,
                  glassesHeight
                );
                ctx.globalAlpha = 1.0;
                ctx.restore();
              }
            }
          } catch (err) {
            console.error('Face detection error:', err);
          }

          animationFrameRef.current = requestAnimationFrame(renderFrame);
        };

        renderFrame();

        setIsCameraReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        if (mounted) {
          setError('Unable to access camera or load face detection. Please allow camera permissions.');
          setIsLoading(false);
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, [isOpen, glassesImage]);

  const capturePhoto = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setCapturedImage(dataUrl);
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `${productName.replace(/\s+/g, '-')}-tryon.png`;
    link.href = capturedImage;
    link.click();
  };

  const retake = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-xl font-bold">Virtual Try-On</h2>
              <p className="text-sm text-gray-300">{productName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Loading AI Face Tracking...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <Camera className="h-12 w-12 mb-4 text-red-500" />
              <p className="text-red-400 mb-2 text-center px-4">{error}</p>
              <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg mt-4">
                Close
              </button>
            </div>
          )}

          {!capturedImage ? (
            <>
              <video ref={videoRef} className="hidden" playsInline muted autoPlay />
              <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            </>
          ) : (
            <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          )}
        </div>

        {/* Controls */}
        {isCameraReady && !error && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="flex items-center justify-center gap-4">
              {!capturedImage ? (
                <button onClick={capturePhoto} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-red-600/50 transition-all duration-300 flex items-center gap-2 hover:scale-105">
                  <Camera className="h-6 w-6" />
                  Capture Photo
                </button>
              ) : (
                <>
                  <button onClick={retake} className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105">
                    <RotateCcw className="h-5 w-5" />
                    Retake
                  </button>
                  <button onClick={downloadPhoto} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105">
                    <Download className="h-5 w-5" />
                    Download
                  </button>
                </>
              )}
            </div>
            {!capturedImage && (
              <p className="text-center text-white/80 text-sm mt-4">
                Position your face in the frame - glasses will automatically adjust to your face
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
