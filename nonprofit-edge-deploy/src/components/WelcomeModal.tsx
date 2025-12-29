/**
 * THE NONPROFIT EDGE - Welcome Modal
 * First-time login profile setup
 * 
 * Features:
 * - Auto-generated initials as default avatar
 * - 8 illustrated avatar options to choose from
 * - Photo upload option
 * - Organization logo upload (optional)
 * - Saves to Supabase on completion
 */

import React, { useState, useRef } from 'react';

const NAVY = '#1a365d';
const TEAL = '#00a0b0';

// Illustrated avatar options - SVG data
const AVATAR_OPTIONS = [
  { id: 'avatar-1', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', skin: '#D4A574', hair: '#1a365d', outfit: '#00a0b0' },
  { id: 'avatar-2', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', skin: '#8B6914', hair: '#1a365d', outfit: '#1a365d' },
  { id: 'avatar-3', bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', skin: '#C4956A', hair: '#4a3728', outfit: '#9333ea' },
  { id: 'avatar-4', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', skin: '#5D4037', hair: '#1a1a1a', outfit: '#059669' },
  { id: 'avatar-5', bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', skin: '#FDBF6F', hair: '#be185d', outfit: '#0ea5e9' },
  { id: 'avatar-6', bg: 'linear-gradient(135deg, #fef9c3, #fef08a)', skin: '#E8BEAC', hair: '#78350f', outfit: '#f59e0b' },
  { id: 'avatar-7', bg: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)', skin: '#3D2314', hair: '#1a1a1a', outfit: '#7c3aed' },
  { id: 'avatar-8', bg: 'linear-gradient(135deg, #ffedd5, #fed7aa)', skin: '#A0522D', hair: '#1a1a1a', outfit: '#ea580c' },
];

// Generate gradient colors based on string
const getGradientForInitials = (name: string): string => {
  const colors = [
    ['#00a0b0', '#008090'],
    ['#1a365d', '#0f172a'],
    ['#7c3aed', '#5b21b6'],
    ['#059669', '#047857'],
    ['#dc2626', '#b91c1c'],
    ['#ea580c', '#c2410c'],
    ['#0ea5e9', '#0284c7'],
    ['#8b5cf6', '#7c3aed'],
  ];
  const index = name.charCodeAt(0) % colors.length;
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
};

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Get org initials
const getOrgInitials = (orgName: string): string => {
  if (!orgName) return 'ORG';
  const words = orgName.trim().split(' ');
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w.charAt(0)).join('').substring(0, 3).toUpperCase();
};

interface WelcomeModalProps {
  isOpen: boolean;
  user: any;
  organization: any;
  supabase: any;
  onComplete: () => void;
  onSkip: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  user,
  organization,
  supabase,
  onComplete,
  onSkip
}) => {
  const [displayName, setDisplayName] = useState(user?.full_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const initials = getInitials(displayName || user?.full_name || 'User');
  const orgInitials = getOrgInitials(organization?.name || 'Organization');
  const initialsGradient = getGradientForInitials(displayName || user?.full_name || 'User');
  const orgGradient = getGradientForInitials(organization?.name || 'Org');

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedPhoto(e.target?.result as string);
      setSelectedAvatar(null); // Clear avatar selection
    };
    reader.readAsDataURL(file);
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle complete setup
  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare avatar data
      let avatarUrl = null;
      
      if (uploadedPhoto) {
        // Upload photo to Supabase storage
        const fileName = `avatars/${user.id}-${Date.now()}.jpg`;
        const base64Data = uploadedPhoto.split(',')[1];
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, decode(base64Data), {
            contentType: 'image/jpeg'
          });
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = publicUrl;
      } else if (selectedAvatar) {
        // Store avatar ID
        avatarUrl = `avatar:${selectedAvatar}`;
      }

      // Update user profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: displayName,
          avatar_url: avatarUrl,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Upload org logo if provided
      if (uploadedLogo && organization?.id) {
        const logoFileName = `logos/${organization.id}-${Date.now()}.png`;
        const base64LogoData = uploadedLogo.split(',')[1];
        
        const { error: logoUploadError } = await supabase.storage
          .from('logos')
          .upload(logoFileName, decode(base64LogoData), {
            contentType: 'image/png'
          });
        
        if (!logoUploadError) {
          const { data: { publicUrl: logoUrl } } = supabase.storage
            .from('logos')
            .getPublicUrl(logoFileName);

          await supabase
            .from('organizations')
            .update({ logo_url: logoUrl })
            .eq('id', organization.id);
        }
      }

      // Mark welcome completed in localStorage
      localStorage.setItem('nonprofit-edge-welcome-completed', 'true');
      
      onComplete();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skip
  const handleSkip = () => {
    localStorage.setItem('nonprofit-edge-welcome-completed', 'true');
    onSkip();
  };

  // Decode base64
  const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Render avatar SVG
  const renderAvatarSVG = (avatar: typeof AVATAR_OPTIONS[0]) => (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="18" r="10" fill={avatar.skin} />
      <ellipse cx="24" cy="42" rx="14" ry="10" fill={avatar.outfit} />
      <path d="M16 14c0-4 4-7 8-7s8 3 8 7c0 1-1 2-1 3h-14c0-1-1-2-1-3z" fill={avatar.hair} />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div 
          className="px-6 py-5"
          style={{ background: `linear-gradient(135deg, ${NAVY}, #122443)` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome to The Nonprofit Edge!</h2>
              <p className="text-white/70 text-sm">Let's personalize your experience</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Profile Photo Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Profile Photo
            </label>
            <div className="flex items-start gap-4">
              {/* Current/Selected Avatar */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0"
                style={{ 
                  background: uploadedPhoto 
                    ? 'none' 
                    : selectedAvatar 
                      ? AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.bg 
                      : initialsGradient 
                }}
              >
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : selectedAvatar ? (
                  renderAvatarSVG(AVATAR_OPTIONS.find(a => a.id === selectedAvatar)!)
                ) : (
                  initials
                )}
              </div>

              {/* Options */}
              <div className="flex-1">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition mb-3"
                  style={{ backgroundColor: TEAL }}
                >
                  📷 Upload Photo
                </button>
                <p className="text-xs text-gray-500 mb-3">Or choose an illustrated avatar:</p>

                {/* Avatar Options */}
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => {
                        setSelectedAvatar(avatar.id);
                        setUploadedPhoto(null);
                      }}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                        selectedAvatar === avatar.id 
                          ? 'border-[#00a0b0] shadow-lg' 
                          : 'border-transparent hover:border-[#00a0b0]'
                      }`}
                      style={{ background: avatar.bg }}
                    >
                      {renderAvatarSVG(avatar)}
                    </button>
                  ))}
                </div>

                {/* Reset to initials */}
                {(selectedAvatar || uploadedPhoto) && (
                  <button
                    onClick={() => {
                      setSelectedAvatar(null);
                      setUploadedPhoto(null);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-2"
                  >
                    ↩ Use my initials instead
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a0b0] focus:border-transparent outline-none"
              placeholder="How should we address you?"
            />
          </div>

          {/* Organization Logo Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Organization Logo <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <div className="flex items-start gap-4">
              {/* Current/Selected Logo */}
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-lg font-bold overflow-hidden flex-shrink-0"
                style={{ background: uploadedLogo ? 'none' : orgGradient }}
              >
                {uploadedLogo ? (
                  <img src={uploadedLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  orgInitials
                )}
              </div>

              {/* Options */}
              <div className="flex-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition mb-2"
                >
                  📁 Upload Logo
                </button>
                <p className="text-xs text-gray-500">PNG, JPG, or SVG up to 2MB</p>
                <p className="text-xs text-gray-400 mt-2">
                  Or use auto-generated initials (shown left)
                </p>
                {uploadedLogo && (
                  <button
                    onClick={() => setUploadedLogo(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-1"
                  >
                    ↩ Use initials instead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button 
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            Skip for now
          </button>
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: TEAL }}
          >
            {isLoading ? 'Saving...' : 'Complete Setup →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
