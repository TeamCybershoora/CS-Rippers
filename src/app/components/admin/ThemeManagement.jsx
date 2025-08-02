'use client';

import { useState } from 'react';

export default function ThemeManagement({ data, onRefresh, loading }) {
  const [selectedWallpaper, setSelectedWallpaper] = useState('');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [secondaryColor, setSecondaryColor] = useState('#764ba2');
  const [accentColor, setAccentColor] = useState('#ff6b6b');
  const [darkMode, setDarkMode] = useState(false);
  const [glassEffect, setGlassEffect] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [saving, setSaving] = useState(false);

  const { currentSettings = {}, availableThemes = {} } = data;

  // Initialize form with current settings
  useState(() => {
    if (currentSettings) {
      setSelectedWallpaper(currentSettings.currentWallpaper || 'ventura');
      setCustomWallpaperUrl(currentSettings.customWallpaper?.url || '');
      setPrimaryColor(currentSettings.primaryColor || '#667eea');
      setSecondaryColor(currentSettings.secondaryColor || '#764ba2');
      setAccentColor(currentSettings.accentColor || '#ff6b6b');
      setDarkMode(currentSettings.darkMode || false);
      setGlassEffect(currentSettings.glassEffect !== false);
      setAnimations(currentSettings.animations !== false);
    }
  }, [currentSettings]);

  const handleSaveTheme = async () => {
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/admin/themes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wallpaper: selectedWallpaper,
          customWallpaper: customWallpaperUrl ? { url: customWallpaperUrl, name: 'Custom Wallpaper' } : null,
          primaryColor,
          secondaryColor,
          accentColor,
          darkMode,
          glassEffect,
          animations
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onRefresh();
        alert('Theme settings updated successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadWallpaper = async (file) => {
    if (!file) return;

    // In a real app, you would upload to Cloudinary or another service
    // For now, we'll simulate the upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setCustomWallpaperUrl(data.secure_url);
        setSelectedWallpaper('custom');
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const WallpaperPreview = ({ wallpaper, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/20 hover:border-white/40'
      }`}
    >
      <div 
        className="w-full h-full"
        style={{ background: wallpaper.gradient }}
      ></div>
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <span className="text-white text-xs font-medium">{wallpaper.name}</span>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );

  const ColorPicker = ({ label, value, onChange }) => (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-white/60 text-sm">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-white/20'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Theme Management</h1>
          <p className="text-white/70 mt-1">Customize the platform's appearance and wallpapers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSaveTheme}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Theme Preview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Current Theme Preview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-32 rounded-lg overflow-hidden border border-white/20">
              <div 
                className="w-full h-full relative"
                style={{ 
                  background: selectedWallpaper === 'custom' && customWallpaperUrl 
                    ? `url(${customWallpaperUrl})` 
                    : availableThemes.wallpapers?.find(w => w.id === selectedWallpaper)?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-lg font-semibold">CS Rippers</div>
                    <div className="text-white/80 text-sm">Desktop Preview</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/70 text-sm">Desktop Wallpaper Preview</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Color Scheme</h4>
              <div className="flex space-x-3">
                <div className="flex-1 text-center">
                  <div 
                    className="w-full h-12 rounded-lg border border-white/20"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div className="text-white/70 text-xs mt-1">Primary</div>
                </div>
                <div className="flex-1 text-center">
                  <div 
                    className="w-full h-12 rounded-lg border border-white/20"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <div className="text-white/70 text-xs mt-1">Secondary</div>
                </div>
                <div className="flex-1 text-center">
                  <div 
                    className="w-full h-12 rounded-lg border border-white/20"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="text-white/70 text-xs mt-1">Accent</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Dark Mode</span>
                  <span className="text-white">{darkMode ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Glass Effect</span>
                  <span className="text-white">{glassEffect ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Animations</span>
                  <span className="text-white">{animations ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Wallpaper Selection</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {availableThemes.wallpapers?.map((wallpaper) => (
            <WallpaperPreview
              key={wallpaper.id}
              wallpaper={wallpaper}
              isSelected={selectedWallpaper === wallpaper.id}
              onClick={() => setSelectedWallpaper(wallpaper.id)}
            />
          ))}
        </div>

        {/* Custom Wallpaper Upload */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="text-white font-medium mb-4">Custom Wallpaper</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Upload Custom Wallpaper
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadWallpaper(e.target.files[0])}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Or Enter Image URL
              </label>
              <input
                type="url"
                value={customWallpaperUrl}
                onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="https://example.com/wallpaper.jpg"
              />
            </div>
            
            {customWallpaperUrl && (
              <button
                onClick={() => setSelectedWallpaper('custom')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
              >
                Use Custom Wallpaper
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Color Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ColorPicker
            label="Primary Color"
            value={primaryColor}
            onChange={setPrimaryColor}
          />
          <ColorPicker
            label="Secondary Color"
            value={secondaryColor}
            onChange={setSecondaryColor}
          />
          <ColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={setAccentColor}
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Theme Settings</h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Dark Mode"
            description="Enable dark theme across the platform"
            checked={darkMode}
            onChange={setDarkMode}
          />
          
          <ToggleSwitch
            label="Glass Effect"
            description="Enable glassmorphism effects for modern UI"
            checked={glassEffect}
            onChange={setGlassEffect}
          />
          
          <ToggleSwitch
            label="Animations"
            description="Enable smooth animations and transitions"
            checked={animations}
            onChange={setAnimations}
          />
        </div>
      </div>
    </div>
  );
}