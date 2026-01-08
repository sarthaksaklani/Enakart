'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export default function SellerProfilePage() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile: '',
    gender: 'male',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    business_name: '',
    gst_number: '',
    business_license: '',
    business_address: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'seller') {
      router.push('/account');
    } else {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        mobile: user.mobile || '',
        gender: user.gender || 'male',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        business_name: user.business_name || '',
        gst_number: user.gst_number || '',
        business_license: user.business_license || '',
        business_address: user.business_address || '',
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'seller') {
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
      gender: user.gender || 'male',
      address_line1: user.address_line1 || '',
      address_line2: user.address_line2 || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      business_name: user.business_name || '',
      gst_number: user.gst_number || '',
      business_license: user.business_license || '',
      business_address: user.business_address || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Business Profile</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-red-500">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  ) : (
                    <p className="text-white text-lg font-semibold">{user.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  ) : (
                    <p className="text-white text-lg font-semibold">{user.last_name}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Email</label>
                <p className="text-white text-lg">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <p className="text-white text-lg">{user.mobile}</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  >
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
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-red-500">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Business Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <p className="text-white text-lg font-semibold">
                    {user.business_name || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">GST Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <p className="text-white text-lg">{user.gst_number || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Business License</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="business_license"
                    value={formData.business_license}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <p className="text-white text-lg">{user.business_license || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Business Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="business_address"
                    value={formData.business_address}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <p className="text-white text-lg">{user.business_address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-red-500">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Address Line 1</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white text-lg">{user.address_line1 || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Address Line 2</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white text-lg">{user.address_line2 || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white text-lg">{user.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white text-lg">{user.state || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Pincode</label>
              {isEditing ? (
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white text-lg">{user.pincode || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
