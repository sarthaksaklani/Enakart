// src/components/products/SimpleVirtualTryOn.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Download, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface SimpleVirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  glassesImage: string;
  productName: string;
}

export const SimpleVirtualTryOn: React.FC<SimpleVirtualTryOnProps> = ({
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
  const [glassesPosition, setGlassesPosition] = useState({ x: 50, y: 40 });
  const [glassesSize, setGlassesSize] = useState(35);
  const [glassesRotation, setGlassesRotation] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Cleanup when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let mounted = true;

    const initializeCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!mounted || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        await videoRef.current.play();

        if (mounted) {
          setIsCameraReady(true);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Camera initialization error:', err);
        if (mounted) {
          let errorMessage = 'Unable to access camera. ';

          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = 'Camera access denied. Please allow camera permissions in your browser settings and reload the page.';
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMessage = 'No camera found on your device.';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage = 'Camera is being used by another application. Please close other apps using the camera.';
          } else {
            errorMessage = 'Unable to access camera. Please check your browser settings and try again.';
          }

          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw mirrored video
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Calculate glasses overlay position
    const glassesWidth = (canvas.width * glassesSize) / 100;
    const glassesHeight = glassesWidth * 0.35; // Maintain aspect ratio

    const centerX = (canvas.width * glassesPosition.x) / 100;
    const centerY = (canvas.height * glassesPosition.y) / 100;

    // Create temporary image for glasses
    const glassesImg = new window.Image();
    glassesImg.crossOrigin = 'anonymous';
    glassesImg.onload = () => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((glassesRotation * Math.PI) / 180);
      ctx.globalAlpha = 0.9;
      ctx.drawImage(
        glassesImg,
        -glassesWidth / 2,
        -glassesHeight / 2,
        glassesWidth,
        glassesHeight
      );
      ctx.restore();

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
    };
    glassesImg.src = glassesImage;
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
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between text-white mb-4 bg-black/50 backdrop-blur-sm p-4 rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">Virtual Try-On</h2>
            <p className="text-sm text-gray-300">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative flex-1 flex items-center justify-center bg-zinc-900 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/80">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Starting Camera...</p>
              <p className="text-sm text-gray-400 mt-2">Please allow camera access</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/90 p-6">
              <AlertCircle className="h-16 w-16 mb-4 text-red-500" />
              <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
              <p className="text-red-400 mb-4 text-center max-w-md">{error}</p>

              <div className="bg-zinc-800 p-4 rounded-lg mb-6 max-w-md">
                <h4 className="font-semibold mb-2 text-sm">How to enable camera:</h4>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Click the camera icon in the address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Reload the page and try again</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!capturedImage ? (
            <div className="relative w-full h-full">
              {/* Video with mirror effect */}
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                style={{ transform: 'scaleX(-1)' }}
                playsInline
                muted
                autoPlay
              />

              {/* Glasses Overlay */}
              {isCameraReady && !error && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${glassesPosition.x}%`,
                    top: `${glassesPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${glassesRotation}deg)`,
                    width: `${glassesSize}%`,
                    opacity: 0.9,
                  }}
                >
                  <Image
                    src={glassesImage}
                    alt="Glasses overlay"
                    width={500}
                    height={175}
                    className="w-full h-auto"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                  />
                </div>
              )}

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Controls */}
        {isCameraReady && !error && (
          <div className="mt-4 bg-black/50 backdrop-blur-sm p-4 rounded-b-lg">
            {!capturedImage ? (
              <div className="space-y-4">
                {/* Adjustment Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-sm">
                  <div>
                    <label className="block mb-2">Position (Vertical)</label>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      value={glassesPosition.y}
                      onChange={(e) =>
                        setGlassesPosition((prev) => ({ ...prev, y: Number(e.target.value) }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Size</label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      value={glassesSize}
                      onChange={(e) => setGlassesSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Rotation</label>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      value={glassesRotation}
                      onChange={(e) => setGlassesRotation(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Capture Button */}
                <div className="flex justify-center">
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-red-600/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <Camera className="h-6 w-6" />
                    Capture Photo
                  </button>
                </div>

                <p className="text-center text-white/80 text-sm">
                  Adjust the position, size, and angle to fit the glasses on your face
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={retake}
                  className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <RotateCcw className="h-5 w-5" />
                  Retake
                </button>
                <button
                  onClick={downloadPhoto}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Download className="h-5 w-5" />
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
