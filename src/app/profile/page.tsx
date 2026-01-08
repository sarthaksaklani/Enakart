'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Edit2, Save, X, ArrowLeft } from 'lucide-react';

export default function CustomerProfilePage() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    phone: '',
    gender: 'male',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account');
    } else if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mobile: user.mobile || '',
        phone: user.phone || '',
        gender: user.gender || 'male',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      gender: formData.gender as 'male' | 'female' | 'other',
      updated_at: new Date().toISOString(),
    };
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      mobile: user.mobile || '',
      phone: user.phone || '',
      gender: user.gender || 'male',
      address_line1: user.address_line1 || '',
      address_line2: user.address_line2 || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Details Section */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm block mb-2">First Name</label>
              {isEditing ? (
                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg font-semibold">{user.first_name}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Last Name</label>
              {isEditing ? (
                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg font-semibold">{user.last_name}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Email</label>
              <p className="text-white text-lg">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Mobile Number</label>
              {isEditing ? (
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.mobile}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Alternative Phone</label>
              {isEditing ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.phone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Gender</label>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-white text-lg capitalize">{user.gender}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm">Account Type</label>
              <p className="text-white text-lg mt-2">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold capitalize">{user.role}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Address Line 1</label>
              {isEditing ? (
                <input type="text" name="address_line1" value={formData.address_line1} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.address_line1 || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Address Line 2</label>
              {isEditing ? (
                <input type="text" name="address_line2" value={formData.address_line2} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.address_line2 || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">City</label>
              {isEditing ? (
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">State</label>
              {isEditing ? (
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.state || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Pincode</label>
              {isEditing ? (
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500" />
              ) : (
                <p className="text-white text-lg">{user.pincode || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Created Date */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">Account Created</label>
              <p className="text-white text-lg">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Last Updated</label>
              <p className="text-white text-lg">
                {new Date(user.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
