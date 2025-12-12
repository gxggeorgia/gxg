'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Globe, Instagram, MessageCircle, Twitter, Facebook, Calendar, Ruler, Weight, Heart, Languages as LanguagesIcon, DollarSign, Star, Crown } from 'lucide-react';
import { locations } from '@/data/locations';
import { services as allServices } from '@/data/services';
import type { RegisterFormData } from '@/types/auth';

interface UserProfile extends Omit<RegisterFormData, 'password' | 'confirmPassword' | 'incallRates' | 'outcallRates'> {
  id: string;
  email: string;
  role: 'escort' | 'admin';
  isGold?: boolean;
  isFeatured?: boolean;
  isSilver?: boolean;
  goldExpiresAt: string | null;
  featuredExpiresAt: string | null;
  silverExpiresAt: string | null;

  verifiedPhotos: boolean;
  publicExpiry: string | null;
  lastActive: string | null;
  createdAt: string;
  slug: string;
  coverImage?: string | null;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    size: number;
    mimeType: string;
    isPrimary?: boolean;
  }>;
  videos?: Array<{
    url: string;
    width?: number;
    height?: number;
    duration?: number;
    size: number;
    mimeType: string;
    thumbnailUrl?: string;
  }>;
  rates?: {
    incall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
    outcall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
  };
}

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [imageUploadStatus, setImageUploadStatus] = useState<{ [key: number]: 'waiting' | 'uploading' | 'success' | 'error' }>({});
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const [deletingVideo, setDeletingVideo] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [settingCoverImage, setSettingCoverImage] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const setCoverImage = async (imageUrl: string) => {
    setSettingCoverImage(true);
    setNotification({ type: 'success', message: 'Setting cover image...' });
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImage: imageUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setNotification({ type: 'success', message: 'Cover image updated successfully!' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: 'Failed to set cover image' });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error setting cover image' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSettingCoverImage(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url); // Clean up memory
      };
      img.onerror = () => {
        URL.revokeObjectURL(url); // Clean up on error too
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate files
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const currentCount = profile?.images?.length || 0;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(files)) {
      if (currentCount + selectedImages.length + newFiles.length >= 10) {
        setNotification({ type: 'error', message: 'Maximum 10 images allowed' });
        break;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        setNotification({ type: 'error', message: `Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.` });
        continue;
      }
      if (file.size > MAX_SIZE) {
        setNotification({ type: 'error', message: `File too large: ${file.name}. Maximum size is 10MB.` });
        continue;
      }

      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedImages([...selectedImages, ...newFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    e.target.value = ''; // Clear input
  };

  const removeSelectedImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);
    const errors: string[] = [];
    let successCount = 0;

    // Set all files to waiting initially
    const initialStatus: { [key: number]: 'waiting' } = {};
    for (let i = 0; i < selectedImages.length; i++) {
      initialStatus[i] = 'waiting';
    }
    setImageUploadStatus(initialStatus);

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];

        // Set uploading status for this file
        setImageUploadStatus(prev => ({ ...prev, [i]: 'uploading' }));

        try {
          const dimensions = await getImageDimensions(file);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'image');
          formData.append('width', dimensions.width.toString());
          formData.append('height', dimensions.height.toString());

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            errors.push(`${file.name}: ${error.error || 'Upload failed'}`);
            setImageUploadStatus(prev => ({ ...prev, [i]: 'error' }));
          } else {
            successCount++;
            setImageUploadStatus(prev => ({ ...prev, [i]: 'success' }));
          }
        } catch (err: any) {
          errors.push(`${file.name}: ${err.message || 'Upload failed'}`);
          setImageUploadStatus(prev => ({ ...prev, [i]: 'error' }));
        }
      }

      // Wait a bit to show success status
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear selections and previews
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setSelectedImages([]);
      setImagePreviews([]);
      setImageUploadStatus({});

      // Refresh profile
      await fetchProfile();

      if (errors.length > 0) {
        setNotification({ type: 'error', message: `Uploaded ${successCount} image(s). Errors: ${errors.join(', ')}` });
      } else {
        setNotification({ type: 'success', message: `Successfully uploaded ${successCount} image(s)!` });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: `Failed to upload images: ${err.message}` });
    } finally {
      setUploadingImages(false);
    }
  };

  const getVideoMetadata = (file: File): Promise<{ width: number; height: number; duration: number }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setNotification({ type: 'error', message: 'Invalid file type. Only MP4, WebM, and MOV are allowed.' });
      e.target.value = ''; // Clear input
      return;
    }
    if (file.size > MAX_SIZE) {
      setNotification({ type: 'error', message: 'File too large. Maximum size is 100MB.' });
      e.target.value = ''; // Clear input
      return;
    }

    // Clear previous video if any
    if (videoPreviews) {
      URL.revokeObjectURL(videoPreviews);
    }

    setSelectedVideo(file);
    setVideoPreviews(URL.createObjectURL(file));
    e.target.value = ''; // Clear input
  };

  const removeSelectedVideo = () => {
    if (videoPreviews) {
      URL.revokeObjectURL(videoPreviews);
    }
    setSelectedVideo(null);
    setVideoPreviews(null);
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;

    setUploadingVideo(true);
    try {
      const metadata = await getVideoMetadata(selectedVideo);

      const formData = new FormData();
      formData.append('file', selectedVideo);
      formData.append('type', 'video');
      formData.append('width', metadata.width.toString());
      formData.append('height', metadata.height.toString());
      formData.append('duration', metadata.duration.toString());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      // Clear selection and preview
      if (videoPreviews) {
        URL.revokeObjectURL(videoPreviews);
      }
      setSelectedVideo(null);
      setVideoPreviews(null);

      // Refresh profile
      await fetchProfile();
      setNotification({ type: 'success', message: 'Video uploaded successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: `Failed to upload video: ${err.message}` });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    // Add to deleting set
    setDeletingImages(prev => new Set(prev).add(imageUrl));

    try {
      const response = await fetch('/api/profile/delete-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, type: 'image' }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      await fetchProfile();
      setNotification({ type: 'success', message: 'Image deleted successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: `Failed to delete image: ${err.message}` });
    } finally {
      // Remove from deleting set
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  };

  const handleDeleteVideo = async (videoUrl: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    setDeletingVideo(true);

    try {
      const response = await fetch('/api/profile/delete-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl, type: 'video' }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      await fetchProfile();
      setNotification({ type: 'success', message: 'Video deleted successfully!' });
    } catch (err: any) {
      setNotification({ type: 'error', message: `Failed to delete video: ${err.message}` });
    } finally {
      setDeletingVideo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const cityName = locations.find(l => l.id === profile.city)?.name[locale as 'en' | 'ka' | 'ru'];
  const districtName = locations.find(l => l.id === profile.city)?.districts.find(d => d.id === profile.district)?.name[locale as 'en' | 'ka' | 'ru'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`rounded-2xl shadow-2xl p-5 flex items-center justify-between backdrop-blur-sm border ${notification.type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400/50'
            : 'bg-gradient-to-r from-red-500 to-rose-500 border-red-400/50'
            } text-white`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <div className="flex-shrink-0 animate-bounce">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              <div>
                <p className="text-sm font-bold">
                  {notification.message.includes('Setting') && (
                    <span className="inline-block animate-spin mr-2">⏳</span>
                  )}
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition duration-200 hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">

        {/* Premium Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gray-200">
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-4 md:px-8 md:py-8">
            {/* Subscription Badges - Single Row */}
            <div className="mb-2 md:mb-4 flex gap-2 overflow-x-auto scrollbar-hide justify-center md:justify-end">
              {/* Silver Badge */}
              {profile.isSilver && (
                <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-gray-700 border-2 border-gray-400 shadow-lg flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Crown size={14} className="text-white md:w-4 md:h-4" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[10px] md:text-xs leading-tight whitespace-nowrap">SILVER</span>
                      {profile.silverExpiresAt && (
                        <span className="text-gray-100 text-[8px] md:text-[10px] leading-tight whitespace-nowrap">
                          {new Date(profile.silverExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Gold Badge */}
              {profile.isGold && (
                <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-yellow-700 border-2 border-yellow-400 shadow-lg flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Crown size={14} className="text-white md:w-4 md:h-4" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[10px] md:text-xs leading-tight whitespace-nowrap">GOLD</span>
                      {profile.goldExpiresAt && (
                        <span className="text-yellow-100 text-[8px] md:text-[10px] leading-tight whitespace-nowrap">
                          {new Date(profile.goldExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURED Badge */}
              {profile.isFeatured && (
                <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-blue-700 border-2 border-blue-400 shadow-lg flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-white md:w-4 md:h-4 fill-white" />
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[10px] md:text-xs leading-tight whitespace-nowrap">FEATURED</span>
                      {profile.featuredExpiresAt && (
                        <span className="text-blue-100 text-[8px] md:text-[10px] leading-tight whitespace-nowrap">
                          {new Date(profile.featuredExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Verified Photos Badge */}
            {profile.verifiedPhotos && (
              <div className="px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-green-700 border-2 border-green-400 shadow-lg flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white md:w-4 md:h-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[10px] md:text-xs leading-tight whitespace-nowrap">100% VERIFIED PHOTOS</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
              <User size={48} className="text-purple-600 md:w-16 md:h-16" />
            </div>
            <div className="flex-1 text-center md:text-left text-black">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-4xl font-bold">{profile.name || t('common.user')}</h1>
                <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold capitalize border border-amber-400/30">
                    {profile.role}
                  </span>
                  {/* Status Badge */}
                  <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg ${(profile.publicExpiry && new Date(profile.publicExpiry) > new Date()) ? 'bg-green-600' : 'bg-yellow-600'}`}>

                    {(profile.publicExpiry && new Date(profile.publicExpiry) > new Date()) && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}

                    <span className="text-white font-bold text-[10px] md:text-xs uppercase">
                      {(profile.publicExpiry && new Date(profile.publicExpiry) > new Date()) ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base">
                <div className="flex items-center gap-2 text-black">
                  <Mail size={16} className="md:w-5 md:h-5" />
                  <span className="break-all">{profile.email}</span>
                </div>
                {cityName && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="md:w-5 md:h-5" />
                    <span>{cityName}{districtName && `, ${districtName}`}</span>
                  </div>
                )}
              </div>

              {/* Status Message */}
              {/* Status Message */}

            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="w-full md:w-auto bg-white text-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
            >
              <Edit2 size={18} className="md:w-5 md:h-5" />
              {t('common.editProfile')}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Verification Alert */}
        {(!profile.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {t('common.accountNotVerified')}
                </h3>
                <p className="text-amber-800 mb-4">
                  {t('common.accountNotVerifiedDesc')}
                </p>
                <Link
                  href="/profile/verify"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('common.getVerifiedNow')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Media Upload - Images and Video in Single Row - FULL WIDTH */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Images Section */}
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Public Gallery (10 max)
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">
                {profile?.images?.length || 0} / 10 images uploaded
              </p>

              {/* Uploaded Images */}
              {(profile?.images && profile.images.length > 0) && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {profile.images.map((image: any, index: number) => {
                    const isDeleting = deletingImages.has(image.url);
                    return (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg md:cursor-pointer"
                          onClick={() => setLightboxImage(image.url)}
                        />

                        {/* Deleting Overlay */}
                        {isDeleting && (
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mb-2"></div>
                            <span className="text-white text-sm font-bold drop-shadow-lg">Deleting...</span>
                          </div>
                        )}

                        {!isDeleting && (
                          <>
                            {/* Center View Icon - Desktop only */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(image.url);
                              }}
                              className="hidden md:flex absolute inset-0 items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg"
                              title="View fullscreen"
                            >
                              <div className="bg-white rounded-full p-3 shadow-xl">
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </button>
                            {/* Set as Cover Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverImage(image.url);
                              }}
                              disabled={settingCoverImage}
                              className={`absolute bottom-1 left-1 rounded-md px-2 py-1 flex items-center gap-1 transition shadow-lg md:opacity-0 md:group-hover:opacity-100 ${profile?.coverImage === image.url
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-600/80 text-white hover:bg-blue-600 backdrop-blur-sm'
                                }`}
                              title={profile?.coverImage === image.url ? 'Cover image' : 'Set as cover'}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                              <span className="text-[10px] font-bold uppercase tracking-wide">Cover</span>
                            </button>
                            {(profile && (!profile.publicExpiry || new Date(profile.publicExpiry) <= new Date())) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(image.url);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100 transition shadow-lg"
                                title="Delete image"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Image Previews (before upload) */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagePreviews.map((preview, index) => {
                    const status = imageUploadStatus[index];
                    return (
                      <div key={index} className="relative aspect-square">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-blue-400" />

                        {/* Upload Status Overlay */}
                        {status && (
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center">
                            {status === 'waiting' && (
                              <>
                                <div className="flex space-x-1 mb-2">
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-white text-sm font-bold drop-shadow-lg">Waiting...</span>
                              </>
                            )}
                            {status === 'uploading' && (
                              <>
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mb-2"></div>
                                <span className="text-white text-sm font-bold drop-shadow-lg">Uploading...</span>
                              </>
                            )}
                            {status === 'success' && (
                              <>
                                <svg className="w-14 h-14 text-green-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white text-sm font-bold drop-shadow-lg mt-1">Success!</span>
                              </>
                            )}
                            {status === 'error' && (
                              <>
                                <svg className="w-14 h-14 text-red-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-white text-sm font-bold drop-shadow-lg mt-1">Failed</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Delete Button */}
                        {!status && (!profile?.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && (
                          <button
                            onClick={() => removeSelectedImage(index)}
                            disabled={uploadingImages}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {(!profile?.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && imagePreviews.length === 0 && profile?.images?.length === 0 && (
                <div
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="w-full h-32 md:h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-purple-400 transition cursor-pointer mb-3"
                >
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs md:text-sm text-gray-500">Click to select images</p>
                </div>
              )}

              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImageSelect}
                disabled={uploadingImages || (profile?.publicExpiry && new Date(profile.publicExpiry) > new Date()) ? true : false}
              />

              {(!profile?.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploadingImages}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm"
                  >
                    Select Images
                  </button>
                  {selectedImages.length > 0 && (
                    <button
                      onClick={uploadImages}
                      disabled={uploadingImages}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm"
                    >
                      {uploadingImages ? 'Uploading...' : `Upload (${selectedImages.length})`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Video Section */}
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Public Video (1 max)
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">
                {profile?.videos && profile.videos.length > 0 ? '1 video uploaded' : 'No video uploaded'}
              </p>

              {/* Uploaded Video */}
              {(profile?.videos && profile.videos.length > 0) && (
                <div className="relative mb-3 group">
                  <video
                    id="uploaded-video"
                    src={profile.videos[0].url}
                    className="w-full h-auto rounded-lg bg-black"
                    controls
                  />

                  {/* Deleting Overlay */}
                  {deletingVideo && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col items-center justify-center pointer-events-none">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mb-2"></div>
                      <span className="text-white text-sm font-bold drop-shadow-lg">Deleting...</span>
                    </div>
                  )}

                  {!deletingVideo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(profile.videos![0].url);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100 transition shadow-lg"
                      title="Delete video"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Video Preview (before upload) */}
              {videoPreviews && (
                <div className="relative mb-3 border-2 border-blue-400 rounded-lg">
                  <video src={videoPreviews} className="w-full h-auto rounded-lg bg-black" controls />
                  <button
                    onClick={removeSelectedVideo}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {(!profile?.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && !videoPreviews && !(profile?.videos && profile.videos.length > 0) && (
                <div
                  onClick={() => document.getElementById('video-upload')?.click()}
                  className="w-full h-32 md:h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 transition cursor-pointer mb-3"
                >
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <p className="text-xs md:text-sm text-gray-500">Click to select video</p>
                </div>
              )}

              <input
                type="file"
                id="video-upload"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleVideoSelect}
                disabled={uploadingVideo || (profile?.publicExpiry && new Date(profile.publicExpiry) > new Date()) ? true : false}
              />

              {(!profile?.publicExpiry || new Date(profile.publicExpiry) <= new Date()) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={uploadingVideo}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm"
                  >
                    Select Video
                  </button>
                  {selectedVideo && (
                    <button
                      onClick={uploadVideo}
                      disabled={uploadingVideo}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm"
                    >
                      {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart size={24} className="text-amber-500" />
                {t('auth.aboutYou')}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.aboutYou}</p>
            </div>

            {/* Physical Attributes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Ruler size={24} className="text-amber-500" />
                {t('auth.personalInfo')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.gender')}</p>
                  <p className="font-semibold text-gray-900 capitalize">{profile.gender}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.dateOfBirth')}</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.ethnicity')}</p>
                  <p className="font-semibold text-gray-900 capitalize">{profile.ethnicity}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.height')}</p>
                  <p className="font-semibold text-gray-900">{profile.height} cm</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.weight')}</p>
                  <p className="font-semibold text-gray-900">{profile.weight} kg</p>
                </div>
                {profile.hairColor && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.hairColor')}</p>
                    <p className="font-semibold text-gray-900 capitalize">{profile.hairColor.replace('_', ' ')}</p>
                  </div>
                )}
                {profile.bustSize && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.bustSize')}</p>
                    <p className="font-semibold text-gray-900 uppercase">{profile.bustSize.replace('_', ' ')}</p>
                  </div>
                )}
                {profile.build && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.build')}</p>
                    <p className="font-semibold text-gray-900 capitalize">{profile.build}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.services')}</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {t(`services.${service}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Rates */}
            {(profile.incallAvailable || profile.outcallAvailable) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={24} className="text-green-600" />
                  {t('auth.rates')}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('auth.duration')}</th>
                        {profile.incallAvailable && <th className="text-center py-3 px-4 font-semibold text-purple-700">{t('auth.incall')}</th>}
                        {profile.outcallAvailable && <th className="text-center py-3 px-4 font-semibold text-blue-700">{t('auth.outcall')}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(['thirtyMin', 'oneHour', 'twoHours', 'threeHours', 'sixHours', 'twelveHours', 'twentyFourHours'] as const).map((duration) => {
                        const incallPrice = profile.rates?.incall?.[duration];
                        const outcallPrice = profile.rates?.outcall?.[duration];
                        const hasPrice = (incallPrice && incallPrice !== '0') || (outcallPrice && outcallPrice !== '0');

                        if (!hasPrice) return null;

                        return (
                          <tr key={duration} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900 font-medium">{t(`auth.${duration}`)}</td>
                            {profile.incallAvailable && (
                              <td className="py-3 px-4 text-center">
                                {incallPrice && incallPrice !== '0' ? (
                                  <span className="font-bold text-purple-900">{incallPrice} {profile.currency}</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            )}
                            {profile.outcallAvailable && (
                              <td className="py-3 px-4 text-center">
                                {outcallPrice && outcallPrice !== '0' ? (
                                  <span className="font-bold text-blue-900">{outcallPrice} {profile.currency}</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Rates */}
          <div className="space-y-6">

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && profile.languages.some(l => l.name) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LanguagesIcon size={20} className="text-purple-600" />
                  {t('auth.languagesSpoken')}
                </h2>
                <div className="space-y-2">
                  {profile.languages.filter(l => l.name).map((lang, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3">
                      <span className="font-semibold text-gray-900">{lang.name}</span>
                      <span className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-xs font-medium capitalize">
                        {t(`auth.${lang.level}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {t('common.contactInfo')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={20} className="text-purple-600" />
                  <span className="text-gray-900">{profile.phone}</span>
                </div>
                {profile.whatsappAvailable && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <MessageCircle size={20} className="text-green-600" />
                    <span className="text-gray-900">WhatsApp</span>
                  </div>
                )}
                {profile.viberAvailable && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
                    <MessageCircle size={20} className="text-purple-600" />
                    <span className="text-gray-900">Viber</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(profile.website || profile.instagram || profile.snapchat || profile.twitter || profile.facebook) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('auth.socialMedia')}</h2>
                <div className="space-y-3">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                      <Globe size={20} className="text-blue-600" />
                      <span className="text-gray-900 truncate">{profile.website}</span>
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition">
                      <Instagram size={20} className="text-pink-600" />
                      <span className="text-gray-900">{profile.instagram}</span>
                    </a>
                  )}
                  {profile.snapchat && (
                    <a href={`https://snapchat.com/add/${profile.snapchat}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition">
                      <MessageCircle size={20} className="text-yellow-500" />
                      <span className="text-gray-900">{profile.snapchat}</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition">
                      <Twitter size={20} className="text-sky-600" />
                      <span className="text-gray-900">{profile.twitter}</span>
                    </a>
                  )}
                  {profile.facebook && (
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                      <Facebook size={20} className="text-blue-700" />
                      <span className="text-gray-900 truncate">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-amber-500" />
                {t('common.memberSince')}
              </h2>
              <p className="text-gray-700 font-semibold">
                {new Date(profile.createdAt).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>


        {/* Lightbox Modal - Images Only */}
        {
          lightboxImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setLightboxImage(null)}
            >
              <div className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img
                  src={lightboxImage}
                  alt="Full view"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />

                {/* Close Button */}
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition shadow-xl"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Previous Button */}
                {(profile as any)?.images && (profile as any).images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const images = (profile as any).images;
                        const currentIndex = images.findIndex((img: any) => img.url === lightboxImage);
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                        setLightboxImage(images[prevIndex].url);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 rounded-full p-3 hover:bg-white transition shadow-xl"
                      title="Previous"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const images = (profile as any).images;
                        const currentIndex = images.findIndex((img: any) => img.url === lightboxImage);
                        const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                        setLightboxImage(images[nextIndex].url);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 rounded-full p-3 hover:bg-white transition shadow-xl"
                      title="Next"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        }
      </div >
    </div>
  );
}
