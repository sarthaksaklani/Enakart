// src/components/products/LensWizard.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Eye, Upload, Edit3, Check, FileText, ChevronLeft } from 'lucide-react';
import { LensType, LensPower, LensPrescription, PrescriptionEntryMethod, Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

type WizardStep = 'entry-method' | 'lens-type' | 'power-entry' | 'review';

interface LensWizardProps {
  frameProductId: string;
  frameProductName: string;
  onComplete?: () => void;
}

// Lens type options with pricing
const LENS_TYPES = [
  {
    type: 'single-vision' as LensType,
    name: 'Single Vision',
    description: 'Correct one field of vision (near or far)',
    price: 500,
    icon: Eye
  },
  {
    type: 'bifocal' as LensType,
    name: 'Bifocal',
    description: 'Two prescriptions in one lens',
    price: 1200,
    icon: Eye
  },
  {
    type: 'progressive' as LensType,
    name: 'Progressive',
    description: 'Seamless transition between near and far',
    price: 2000,
    icon: Eye
  },
  {
    type: 'blu-cut' as LensType,
    name: 'Blu Cut',
    description: 'Blue light blocking for digital screens',
    price: 800,
    icon: Eye
  },
  {
    type: 'cr-lens' as LensType,
    name: 'CR Lens',
    description: 'High index, thinner and lighter',
    price: 1500,
    icon: Eye
  },
  {
    type: 'photochromic' as LensType,
    name: 'Photochromic',
    description: 'Automatically adjusts to light conditions',
    price: 1800,
    icon: Eye
  },
  {
    type: 'anti-glare' as LensType,
    name: 'Anti-Glare',
    description: 'Reduces reflections and glare',
    price: 600,
    icon: Eye
  },
];

export const LensWizard: React.FC<LensWizardProps> = ({
  frameProductId,
  frameProductName,
  onComplete
}) => {
  const [step, setStep] = useState<WizardStep>('entry-method');
  const [entryMethod, setEntryMethod] = useState<PrescriptionEntryMethod | null>(null);
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [sameForBothEyes, setSameForBothEyes] = useState<boolean>(true);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [visionType, setVisionType] = useState<'near' | 'far'>('far'); // Addition (+) for near, Subtraction (-) for far

  const [leftEye, setLeftEye] = useState<LensPower>({ sphere: '', cylinder: '', axis: '', add: '' });
  const [rightEye, setRightEye] = useState<LensPower>({ sphere: '', cylinder: '', axis: '', add: '' });
  const [bothEyes, setBothEyes] = useState<LensPower>({ sphere: '', cylinder: '', axis: '', add: '' });

  const { addLensToItem, setLensPrescription, items } = useCartStore();
  const router = useRouter();

  // Get selected lens type details
  const selectedLensDetails = LENS_TYPES.find(l => l.type === selectedLensType);

  // Progress indicator
  const getStepNumber = () => {
    switch (step) {
      case 'entry-method': return 0;
      case 'lens-type': return 1;
      case 'power-entry': return 2;
      case 'review': return 3;
      default: return 0;
    }
  };

  const totalSteps = 4;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  // Navigate to next step
  const handleNext = () => {
    if (step === 'entry-method') {
      setStep('lens-type');
    } else if (step === 'lens-type') {
      if (entryMethod === 'upload') {
        setStep('review');
      } else {
        setStep('power-entry');
      }
    } else if (step === 'power-entry') {
      setStep('review');
    }
  };

  // Navigate to previous step
  const handleBack = () => {
    if (step === 'lens-type') {
      setStep('entry-method');
    } else if (step === 'power-entry') {
      setStep('lens-type');
    } else if (step === 'review') {
      if (entryMethod === 'upload') {
        setStep('lens-type');
      } else {
        setStep('power-entry');
      }
    }
  };

  // Helper function to normalize power value with correct sign
  const normalizePowerValue = (value: string): string => {
    if (!value || value.trim() === '') return value;

    // Remove any existing +/- signs and whitespace
    const cleanValue = value.trim().replace(/^[+-]/, '');

    // If the cleaned value is empty or not a number, return original
    if (!cleanValue || isNaN(parseFloat(cleanValue))) return value;

    // Apply the correct sign based on vision type
    const sign = visionType === 'near' ? '+' : '-';
    return `${sign}${cleanValue}`;
  };

  // Helper function to normalize LensPower object
  const normalizeLensPower = (power: LensPower): LensPower => {
    return {
      sphere: normalizePowerValue(power.sphere),
      cylinder: power.cylinder, // Cylinder can be independent
      axis: power.axis,
      add: power.add,
    };
  };

  // Handle final submission
  const handleProceed = () => {
    if (!selectedLensType || !selectedLensDetails) return;

    // Normalize power values based on vision type selection
    const normalizedLeftEye = !sameForBothEyes ? normalizeLensPower(leftEye) : undefined;
    const normalizedRightEye = !sameForBothEyes ? normalizeLensPower(rightEye) : undefined;
    const normalizedBothEyes = sameForBothEyes ? normalizeLensPower(bothEyes) : undefined;

    // Create prescription object
    const prescription: LensPrescription = {
      entryMethod: entryMethod!,
      prescriptionFile: prescriptionFile ? URL.createObjectURL(prescriptionFile) : undefined,
      lensType: selectedLensType,
      sameForBothEyes: entryMethod === 'upload' ? true : sameForBothEyes,
      leftEye: normalizedLeftEye,
      rightEye: normalizedRightEye,
      bothEyes: normalizedBothEyes,
      price: selectedLensDetails.price,
    };

    // Create a mock lens product
    const lensProduct: Product = {
      id: `lens-${selectedLensType}-${Date.now()}`,
      name: selectedLensDetails.name,
      description: selectedLensDetails.description,
      price: selectedLensDetails.price,
      brand: 'Premium Lenses',
      category: 'lens',
      frame_color: 'Clear',
      gender: 'unisex',
      images: [],
      stock_quantity: 100,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add lens to cart item
    addLensToItem(frameProductId, lensProduct);

    // Update cart item with prescription details
    setLensPrescription(frameProductId, prescription);

    // Navigate to cart
    if (onComplete) {
      onComplete();
    } else {
      router.push('/cart');
    }
  };

  // Validate if can proceed to next step
  const canProceed = () => {
    if (step === 'entry-method') {
      return entryMethod !== null;
    } else if (step === 'lens-type') {
      if (entryMethod === 'upload') {
        return selectedLensType !== null && prescriptionFile !== null;
      }
      return selectedLensType !== null;
    } else if (step === 'power-entry') {
      if (sameForBothEyes) {
        return bothEyes.sphere !== '';
      } else {
        return leftEye.sphere !== '' && rightEye.sphere !== '';
      }
    } else if (step === 'review') {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/cart')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Add Lens to Your Frame</h1>
          <p className="text-gray-400">Frame: {frameProductName}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3">
            {/* Step 1: Entry Method */}
            <div className={`flex flex-col items-center gap-2 ${getStepNumber() >= 0 ? 'text-red-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                getStepNumber() >= 0 ? 'bg-red-600 text-white' : 'bg-gray-800'
              }`}>
                {getStepNumber() > 0 ? <Check className="h-5 w-5" /> : <span className="font-semibold">1</span>}
              </div>
              <span className="text-xs font-medium hidden sm:block">Method</span>
            </div>

            {/* Connector */}
            <div className={`w-12 sm:w-20 h-1 transition-all duration-300 ${
              getStepNumber() >= 1 ? 'bg-red-600' : 'bg-gray-800'
            }`}></div>

            {/* Step 2: Lens Type */}
            <div className={`flex flex-col items-center gap-2 ${getStepNumber() >= 1 ? 'text-red-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                getStepNumber() >= 1 ? 'bg-red-600 text-white' : 'bg-gray-800'
              }`}>
                {getStepNumber() > 1 ? <Check className="h-5 w-5" /> : <span className="font-semibold">2</span>}
              </div>
              <span className="text-xs font-medium hidden sm:block">Lens Type</span>
            </div>

            {/* Connector */}
            <div className={`w-12 sm:w-20 h-1 transition-all duration-300 ${
              getStepNumber() >= 2 ? 'bg-red-600' : 'bg-gray-800'
            }`}></div>

            {/* Step 3: Power Entry */}
            <div className={`flex flex-col items-center gap-2 ${getStepNumber() >= 2 ? 'text-red-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                getStepNumber() >= 2 ? 'bg-red-600 text-white' : 'bg-gray-800'
              }`}>
                {getStepNumber() > 2 ? <Check className="h-5 w-5" /> : <span className="font-semibold">3</span>}
              </div>
              <span className="text-xs font-medium hidden sm:block">Power</span>
            </div>

            {/* Connector */}
            <div className={`w-12 sm:w-20 h-1 transition-all duration-300 ${
              getStepNumber() >= 3 ? 'bg-red-600' : 'bg-gray-800'
            }`}></div>

            {/* Step 4: Review */}
            <div className={`flex flex-col items-center gap-2 ${getStepNumber() >= 3 ? 'text-red-500' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                getStepNumber() >= 3 ? 'bg-red-600 text-white' : 'bg-gray-800'
              }`}>
                <span className="font-semibold">4</span>
              </div>
              <span className="text-xs font-medium hidden sm:block">Review</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">

          {/* Step 0: Entry Method Selection */}
          {step === 'entry-method' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">How would you like to add your prescription?</h2>
              <p className="text-gray-400 mb-8">Choose your preferred method to provide lens power details</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Prescription */}
                <div
                  onClick={() => setEntryMethod('upload')}
                  className={`group cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 rounded-lg p-6 transition-all duration-300 transform hover:scale-105 ${
                    entryMethod === 'upload' ? 'border-red-500 bg-gray-800' : 'border-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                      entryMethod === 'upload' ? 'bg-red-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'
                    }`}>
                      <Upload className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Prescription</h3>
                    <p className="text-gray-400 text-sm">
                      Upload your prescription document and we&apos;ll handle the rest
                    </p>
                  </div>
                </div>

                {/* Manual Entry */}
                <div
                  onClick={() => setEntryMethod('manual')}
                  className={`group cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 rounded-lg p-6 transition-all duration-300 transform hover:scale-105 ${
                    entryMethod === 'manual' ? 'border-red-500 bg-gray-800' : 'border-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                      entryMethod === 'manual' ? 'bg-red-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'
                    }`}>
                      <Edit3 className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Add Power Manually</h3>
                    <p className="text-gray-400 text-sm">
                      Enter your lens power details step by step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Lens Type Selection */}
          {step === 'lens-type' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Lens Type</h2>
              <p className="text-gray-400 mb-8">Choose the type of lens that suits your needs</p>

              {/* Upload prescription file if upload method selected */}
              {entryMethod === 'upload' && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Prescription Document
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="prescription-upload"
                    />
                    <label
                      htmlFor="prescription-upload"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Choose File
                    </label>
                    {prescriptionFile && (
                      <span className="text-green-500 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {prescriptionFile.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LENS_TYPES.map((lens) => (
                  <div
                    key={lens.type}
                    onClick={() => setSelectedLensType(lens.type)}
                    className={`cursor-pointer bg-gray-800/50 hover:bg-gray-800 border-2 rounded-lg p-4 transition-all duration-300 ${
                      selectedLensType === lens.type ? 'border-red-500 bg-gray-800' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedLensType === lens.type ? 'bg-red-500/20' : 'bg-red-500/10'
                      }`}>
                        <lens.icon className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{lens.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{lens.description}</p>
                        <p className="text-red-500 font-semibold">₹{lens.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Power Entry (only for manual entry) */}
          {step === 'power-entry' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Enter Lens Power</h2>
              <p className="text-gray-400 mb-8">Provide your prescription power details</p>

              {/* Same for both eyes toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameForBothEyes}
                    onChange={(e) => setSameForBothEyes(e.target.checked)}
                    className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-white font-medium">Same power for both eyes</span>
                </label>
              </div>

              {/* Vision Type Selection */}
              <div className="mb-8">
                <p className="text-gray-300 font-semibold mb-3 text-sm">Select Vision Type:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Near Vision (Addition +) */}
                  <button
                    type="button"
                    onClick={() => setVisionType('near')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      visionType === 'near'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visionType === 'near'
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-600'
                      }`}>
                        {visionType === 'near' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm">Addition (+) for Near Vision</p>
                          <span className="text-green-400 font-bold text-lg">+</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">
                          For reading or close-up work (e.g., +2.00)
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Far Vision (Subtraction -) */}
                  <button
                    type="button"
                    onClick={() => setVisionType('far')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      visionType === 'far'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visionType === 'far'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-600'
                      }`}>
                        {visionType === 'far' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm">Subtraction (-) for Far Vision</p>
                          <span className="text-blue-400 font-bold text-lg">-</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">
                          For distance viewing (e.g., -2.00)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                <p className="text-yellow-500 text-xs mt-3 flex items-start gap-2">
                  <span className="inline-block w-1 h-1 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>This helps us apply the correct sign if you forget to add +/- to your power values</span>
                </p>
              </div>

              {/* Power Entry Fields */}
              {sameForBothEyes ? (
                // Both Eyes Same
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Power Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Sphere (SPH) *
                      </label>
                      <input
                        type="text"
                        value={bothEyes.sphere}
                        onChange={(e) => setBothEyes({ ...bothEyes, sphere: e.target.value })}
                        placeholder="e.g., -2.00"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cylinder (CYL)
                      </label>
                      <input
                        type="text"
                        value={bothEyes.cylinder}
                        onChange={(e) => setBothEyes({ ...bothEyes, cylinder: e.target.value })}
                        placeholder="e.g., -1.00"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Axis
                      </label>
                      <input
                        type="text"
                        value={bothEyes.axis}
                        onChange={(e) => setBothEyes({ ...bothEyes, axis: e.target.value })}
                        placeholder="e.g., 180"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    {(selectedLensType === 'bifocal' || selectedLensType === 'progressive') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Add (for reading)
                        </label>
                        <input
                          type="text"
                          value={bothEyes.add}
                          onChange={(e) => setBothEyes({ ...bothEyes, add: e.target.value })}
                          placeholder="e.g., +2.00"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Separate for each eye
                <div className="space-y-8">
                  {/* Left Eye */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Left Eye (OS)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sphere (SPH) *
                        </label>
                        <input
                          type="text"
                          value={leftEye.sphere}
                          onChange={(e) => setLeftEye({ ...leftEye, sphere: e.target.value })}
                          placeholder="e.g., -2.00"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cylinder (CYL)
                        </label>
                        <input
                          type="text"
                          value={leftEye.cylinder}
                          onChange={(e) => setLeftEye({ ...leftEye, cylinder: e.target.value })}
                          placeholder="e.g., -1.00"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Axis
                        </label>
                        <input
                          type="text"
                          value={leftEye.axis}
                          onChange={(e) => setLeftEye({ ...leftEye, axis: e.target.value })}
                          placeholder="e.g., 180"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      {(selectedLensType === 'bifocal' || selectedLensType === 'progressive') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Add (for reading)
                          </label>
                          <input
                            type="text"
                            value={leftEye.add}
                            onChange={(e) => setLeftEye({ ...leftEye, add: e.target.value })}
                            placeholder="e.g., +2.00"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Eye */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Right Eye (OD)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sphere (SPH) *
                        </label>
                        <input
                          type="text"
                          value={rightEye.sphere}
                          onChange={(e) => setRightEye({ ...rightEye, sphere: e.target.value })}
                          placeholder="e.g., -2.00"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cylinder (CYL)
                        </label>
                        <input
                          type="text"
                          value={rightEye.cylinder}
                          onChange={(e) => setRightEye({ ...rightEye, cylinder: e.target.value })}
                          placeholder="e.g., -1.00"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Axis
                        </label>
                        <input
                          type="text"
                          value={rightEye.axis}
                          onChange={(e) => setRightEye({ ...rightEye, axis: e.target.value })}
                          placeholder="e.g., 180"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      {(selectedLensType === 'bifocal' || selectedLensType === 'progressive') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Add (for reading)
                          </label>
                          <input
                            type="text"
                            value={rightEye.add}
                            onChange={(e) => setRightEye({ ...rightEye, add: e.target.value })}
                            placeholder="e.g., +2.00"
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Review Your Selection</h2>
              <p className="text-gray-400 mb-8">Please verify your lens details before proceeding</p>

              <div className="space-y-6">
                {/* Frame Details */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Frame Details</h3>
                  <p className="text-gray-300">{frameProductName}</p>
                </div>

                {/* Lens Type */}
                {selectedLensDetails && (
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Lens Type</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{selectedLensDetails.name}</p>
                        <p className="text-gray-400 text-sm">{selectedLensDetails.description}</p>
                      </div>
                      <p className="text-red-500 font-bold text-xl">₹{selectedLensDetails.price}</p>
                    </div>
                  </div>
                )}

                {/* Prescription Details */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Prescription Details</h3>

                  {entryMethod === 'upload' ? (
                    <div>
                      <p className="text-gray-300 mb-2">Method: Upload Prescription</p>
                      {prescriptionFile && (
                        <p className="text-green-500 text-sm flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          {prescriptionFile.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300 mb-2">Method: Manual Entry</p>

                      {/* Vision Type Display */}
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-gray-400">Vision Type:</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          visionType === 'near'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        }`}>
                          {visionType === 'near' ? 'Near Vision (+)' : 'Far Vision (-)'}
                        </span>
                      </div>

                      {sameForBothEyes ? (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Same power for both eyes</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Sphere</p>
                              <p className="text-white font-medium">{normalizePowerValue(bothEyes.sphere) || 'N/A'}</p>
                            </div>
                            {bothEyes.cylinder && (
                              <div>
                                <p className="text-xs text-gray-500">Cylinder</p>
                                <p className="text-white font-medium">{bothEyes.cylinder}</p>
                              </div>
                            )}
                            {bothEyes.axis && (
                              <div>
                                <p className="text-xs text-gray-500">Axis</p>
                                <p className="text-white font-medium">{bothEyes.axis}</p>
                              </div>
                            )}
                            {bothEyes.add && (
                              <div>
                                <p className="text-xs text-gray-500">Add</p>
                                <p className="text-white font-medium">{bothEyes.add}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Left Eye */}
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Left Eye (OS)</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Sphere</p>
                                <p className="text-white font-medium">{normalizePowerValue(leftEye.sphere) || 'N/A'}</p>
                              </div>
                              {leftEye.cylinder && (
                                <div>
                                  <p className="text-xs text-gray-500">Cylinder</p>
                                  <p className="text-white font-medium">{leftEye.cylinder}</p>
                                </div>
                              )}
                              {leftEye.axis && (
                                <div>
                                  <p className="text-xs text-gray-500">Axis</p>
                                  <p className="text-white font-medium">{leftEye.axis}</p>
                                </div>
                              )}
                              {leftEye.add && (
                                <div>
                                  <p className="text-xs text-gray-500">Add</p>
                                  <p className="text-white font-medium">{leftEye.add}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Eye */}
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Right Eye (OD)</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Sphere</p>
                                <p className="text-white font-medium">{normalizePowerValue(rightEye.sphere) || 'N/A'}</p>
                              </div>
                              {rightEye.cylinder && (
                                <div>
                                  <p className="text-xs text-gray-500">Cylinder</p>
                                  <p className="text-white font-medium">{rightEye.cylinder}</p>
                                </div>
                              )}
                              {rightEye.axis && (
                                <div>
                                  <p className="text-xs text-gray-500">Axis</p>
                                  <p className="text-white font-medium">{rightEye.axis}</p>
                                </div>
                              )}
                              {rightEye.add && (
                                <div>
                                  <p className="text-xs text-gray-500">Add</p>
                                  <p className="text-white font-medium">{rightEye.add}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Total Price */}
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-300">Total Lens Price</p>
                      <p className="text-sm text-gray-500">Added to your frame</p>
                    </div>
                    <p className="text-red-500 font-bold text-3xl">₹{selectedLensDetails?.price || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            {step !== 'entry-method' && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            <div className="ml-auto">
              {step === 'review' ? (
                <Button
                  onClick={handleProceed}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  Proceed to Cart
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
