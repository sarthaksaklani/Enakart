'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, ChevronRight, AlertCircle, Eye, DollarSign, FileText, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Define lens types
const LENS_TYPES = [
  { id: 'single-vision', name: 'Single Vision', description: 'For distance or near vision correction' },
  { id: 'bifocal', name: 'Bifocal', description: 'Two distinct viewing areas' },
  { id: 'progressive', name: 'Progressive', description: 'Gradual transition between prescriptions' },
  { id: 'anti-reflective', name: 'Anti-Reflective Coating', description: 'Reduces glare and reflections' },
  { id: 'blue-light', name: 'Blue Light Blocking', description: 'Protects from digital screen light' },
  { id: 'photochromic', name: 'Photochromic (Transition)', description: 'Adapts to light conditions' },
  { id: 'polarized', name: 'Polarized', description: 'Reduces glare from reflective surfaces' },
  { id: 'high-index', name: 'High Index', description: 'Thinner and lighter lenses' },
  { id: 'polycarbonate', name: 'Polycarbonate', description: 'Impact-resistant material' },
  { id: 'trivex', name: 'Trivex', description: 'Lightweight and impact-resistant' },
];

interface LensPrice {
  lensId: string;
  price: string;
}

interface SavedLensDetails {
  hasLensFacility: boolean;
  selectedLenses: string[];
  lensPrices: LensPrice[];
}

export default function LensDetailsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [currentStep, setCurrentStep] = useState(1);
  const [hasLensFacility, setHasLensFacility] = useState<boolean | null>(null);
  const [selectedLenses, setSelectedLenses] = useState<string[]>([]);
  const [lensPrices, setLensPrices] = useState<LensPrice[]>([]);
  const [savedDetails, setSavedDetails] = useState<SavedLensDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
      return;
    }

    // Load saved lens details from localStorage (or API in production)
    loadSavedDetails();
  }, [isAuthenticated, user, router]);

  const loadSavedDetails = () => {
    setIsLoading(true);
    try {
      // In production, this would be an API call
      const saved = localStorage.getItem(`lens_details_${user?.id}`);
      if (saved) {
        const details: SavedLensDetails = JSON.parse(saved);
        setSavedDetails(details);
        setMode('view');
      } else {
        setMode('edit');
      }
    } catch (error) {
      console.error('Error loading lens details:', error);
      setMode('edit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (savedDetails) {
      // Load saved data into edit mode
      setHasLensFacility(savedDetails.hasLensFacility);
      setSelectedLenses(savedDetails.selectedLenses);
      setLensPrices(savedDetails.lensPrices);
      if (savedDetails.hasLensFacility) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
    setMode('edit');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your lens details? This action cannot be undone.')) {
      localStorage.removeItem(`lens_details_${user?.id}`);
      setSavedDetails(null);
      setHasLensFacility(null);
      setSelectedLenses([]);
      setLensPrices([]);
      setCurrentStep(1);
      setMode('edit');
    }
  };

  const handleLensFacilityChoice = (choice: boolean) => {
    setHasLensFacility(choice);
    if (choice) {
      setCurrentStep(2);
    }
  };

  const handleLensSelection = (lensId: string) => {
    setSelectedLenses(prev =>
      prev.includes(lensId)
        ? prev.filter(id => id !== lensId)
        : [...prev, lensId]
    );
  };

  const handleNextFromLensSelection = () => {
    if (selectedLenses.length === 0) {
      alert('Please select at least one lens type');
      return;
    }

    // Initialize prices for selected lenses
    const initialPrices = selectedLenses.map(lensId => {
      // If editing, preserve existing prices
      const existingPrice = lensPrices.find(p => p.lensId === lensId);
      return {
        lensId,
        price: existingPrice?.price || ''
      };
    });
    setLensPrices(initialPrices);
    setCurrentStep(3);
  };

  const handlePriceChange = (lensId: string, price: string) => {
    // Only allow numbers
    if (price && !/^\d*\.?\d*$/.test(price)) {
      return;
    }

    setLensPrices(prev =>
      prev.map(item =>
        item.lensId === lensId ? { ...item, price } : item
      )
    );
  };

  const handleNextFromPricing = () => {
    // Validate all prices are filled
    const allPricesFilled = lensPrices.every(item => item.price && parseFloat(item.price) > 0);

    if (!allPricesFilled) {
      alert('Please enter valid prices for all selected lens types');
      return;
    }

    setCurrentStep(4);
  };

  const handleSubmit = () => {
    // Save data to localStorage (in production, this would be an API call)
    const details: SavedLensDetails = {
      hasLensFacility: hasLensFacility || false,
      selectedLenses,
      lensPrices
    };

    localStorage.setItem(`lens_details_${user?.id}`, JSON.stringify(details));
    setSavedDetails(details);
    setMode('view');

    alert('Lens details saved successfully!');
  };

  const handleBack = () => {
    if (mode === 'view') {
      router.push('/seller/admin');
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (savedDetails) {
      // Cancel editing and return to view mode
      setMode('view');
      setCurrentStep(1);
      setHasLensFacility(null);
      setSelectedLenses([]);
      setLensPrices([]);
    } else {
      router.push('/seller/admin');
    }
  };

  if (!isAuthenticated || user?.role !== 'seller' || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // VIEW MODE - Show saved lens details
  if (mode === 'view' && savedDetails) {
    return (
      <div className="min-h-screen bg-black text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Dashboard</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Lens Details</h1>
                <p className="text-gray-400">Your configured lens offerings and pricing</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Details
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Lens Facility Status */}
          <div className="bg-zinc-900 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                savedDetails.hasLensFacility ? 'bg-green-600' : 'bg-gray-600'
              }`}>
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Lens Facility Status</h2>
                <p className={`text-lg ${savedDetails.hasLensFacility ? 'text-green-400' : 'text-gray-400'}`}>
                  {savedDetails.hasLensFacility
                    ? '✓ You have lens facility'
                    : '✗ No lens facility (Frames and goggles only)'}
                </p>
              </div>
            </div>
          </div>

          {/* Show lens details only if has facility */}
          {savedDetails.hasLensFacility && (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400">Total Lens Types</h3>
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{savedDetails.selectedLenses.length}</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400">Average Price</h3>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">
                    ₹{Math.round(
                      savedDetails.lensPrices.reduce((sum, item) => sum + parseFloat(item.price), 0) /
                      savedDetails.lensPrices.length
                    ).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-400">Price Range</h3>
                    <DollarSign className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold">
                    ₹{Math.min(...savedDetails.lensPrices.map(p => parseFloat(p.price))).toLocaleString('en-IN')} -
                    ₹{Math.max(...savedDetails.lensPrices.map(p => parseFloat(p.price))).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Lens List */}
              <div className="bg-zinc-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Your Lens Offerings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDetails.lensPrices.map((item) => {
                    const lens = LENS_TYPES.find(l => l.id === item.lensId);
                    if (!lens) return null;

                    return (
                      <div key={item.lensId} className="bg-zinc-800 rounded-lg p-5 hover:bg-zinc-700 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">{lens.name}</h3>
                            <p className="text-sm text-gray-400">{lens.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Price</p>
                            <p className="text-2xl font-bold text-green-500">
                              ₹{parseFloat(item.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* No facility message */}
          {!savedDetails.hasLensFacility && (
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-blue-300 mb-2">
                    Consider adding lens services!
                  </h3>
                  <p className="text-blue-200 mb-4">
                    Adding lens services to your shop can help you get more orders and increase revenue.
                  </p>
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update to Add Lens Facility
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // EDIT MODE - Multi-step form
  const steps = [
    { number: 1, title: 'Lens Facility', icon: Eye },
    { number: 2, title: 'Select Lenses', icon: FileText },
    { number: 3, title: 'Set Prices', icon: DollarSign },
    { number: 4, title: 'Review', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>

          <h1 className="text-4xl font-bold mb-2">
            {savedDetails ? 'Edit Lens Details' : 'Configure Lens Details'}
          </h1>
          <p className="text-gray-400">
            {savedDetails ? 'Update your lens offerings and pricing' : 'Set up your lens offerings and pricing'}
          </p>
        </div>

        {/* Progress Steps */}
        {hasLensFacility && (
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-zinc-800">
                <div
                  className="h-full bg-red-600 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Step Items */}
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="relative z-10 flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                      ${isCompleted ? 'bg-red-600' : isCurrent ? 'bg-red-600 ring-4 ring-red-600/30' : 'bg-zinc-800'}
                    `}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <StepIcon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-zinc-900 rounded-lg p-8">
          {/* Step 1: Lens Facility Check */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Eye className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Do you have lens facility?</h2>
                <p className="text-gray-400">Let us know if you can provide lens services</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => handleLensFacilityChoice(true)}
                  className="group relative overflow-hidden rounded-lg bg-zinc-800 p-8 hover:bg-zinc-700 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-red-600"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />

                  <div className="relative text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Yes, I have lens facility</h3>
                    <p className="text-gray-400 text-sm">I can provide lens services to customers</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLensFacilityChoice(false)}
                  className="group relative overflow-hidden rounded-lg bg-zinc-800 p-8 hover:bg-zinc-700 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-red-600"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600 to-red-700 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />

                  <div className="relative text-center">
                    <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No, only goggles and frames</h3>
                    <p className="text-gray-400 text-sm">I sell frames and goggles without lenses</p>
                  </div>
                </button>
              </div>

              {hasLensFacility === false && (
                <div className="mt-8 bg-blue-900/20 border border-blue-600/50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-blue-300 mb-2">
                        Integrate lens services to grow your business!
                      </h3>
                      <p className="text-blue-200 mb-4">
                        Adding lens services to your shop can help you:
                      </p>
                      <ul className="list-disc list-inside text-blue-200 space-y-1">
                        <li>Get more orders from customers looking for complete eyewear solutions</li>
                        <li>Increase your revenue by offering prescription lenses</li>
                        <li>Provide better customer service with one-stop shopping</li>
                        <li>Stand out from competitors who only sell frames</li>
                      </ul>
                      <div className="mt-6 flex gap-3">
                        <Button
                          onClick={() => handleLensFacilityChoice(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          I want to add lens facility
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Save & Continue without lens facility
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Lens Type Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Select Lens Types</h2>
                <p className="text-gray-400">Choose which types of lenses you want to sell</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LENS_TYPES.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => handleLensSelection(lens.id)}
                    className={`
                      group relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300
                      ${selectedLenses.includes(lens.id)
                        ? 'bg-red-900/30 border-2 border-red-600'
                        : 'bg-zinc-800 border-2 border-transparent hover:border-zinc-700'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1
                        ${selectedLenses.includes(lens.id)
                          ? 'bg-red-600 border-red-600'
                          : 'border-gray-600'
                        }
                      `}>
                        {selectedLenses.includes(lens.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{lens.name}</h3>
                        <p className="text-gray-400 text-sm">{lens.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-6 border-t border-zinc-800">
                <Button
                  onClick={handleBack}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNextFromLensSelection}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={selectedLenses.length === 0}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Price Input */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Set Lens Prices</h2>
                <p className="text-gray-400">Enter the price for each lens type you selected</p>
              </div>

              <div className="space-y-4">
                {lensPrices.map((item) => {
                  const lens = LENS_TYPES.find(l => l.id === item.lensId);
                  if (!lens) return null;

                  return (
                    <div key={item.lensId} className="bg-zinc-800 rounded-lg p-6">
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{lens.name}</h3>
                          <p className="text-gray-400 text-sm">{lens.description}</p>
                        </div>

                        <div className="w-48">
                          <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => handlePriceChange(item.lensId, e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 pl-8 py-2 text-white focus:outline-none focus:border-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-6 border-t border-zinc-800">
                <Button
                  onClick={handleBack}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNextFromPricing}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="mb-8 text-center">
                <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Review Your Details</h2>
                <p className="text-gray-400">Please review your lens details before submitting</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-6 space-y-6">
                {/* Facility Status */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Lens Facility</h3>
                  <p className="text-lg font-semibold">
                    {hasLensFacility ? '✓ Available' : '✗ Not Available'}
                  </p>
                </div>

                {/* Selected Lenses Count */}
                <div className="border-t border-zinc-700 pt-6">
                  <h3 className="text-sm text-gray-400 mb-4">Selected Lens Types ({selectedLenses.length})</h3>
                  <div className="space-y-3">
                    {lensPrices.map((item) => {
                      const lens = LENS_TYPES.find(l => l.id === item.lensId);
                      if (!lens) return null;

                      return (
                        <div key={item.lensId} className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
                          <div>
                            <p className="font-semibold">{lens.name}</p>
                            <p className="text-sm text-gray-400">{lens.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-500">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-zinc-800">
                <Button
                  onClick={handleBack}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {savedDetails ? 'Update Details' : 'Submit Details'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
