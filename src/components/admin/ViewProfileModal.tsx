'use client';

import { useState, useEffect } from 'react';
import EscortProfileDisplay from '@/components/EscortProfileDisplay';
import { X, Calendar, Check } from 'lucide-react';
import { User } from '@/db/schema/users';

interface ViewProfileModalProps {
    userId: string;
    onClose: () => void;
    onUpdate: () => void; // To refresh the list after update
}

export default function ViewProfileModal({ userId, onClose, onUpdate }: ViewProfileModalProps) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [expiryDate, setExpiryDate] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/admin/users/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch user');
                const data = await response.json();
                setUser(data.user);

                // Initialize expiry date if exists
                if (data.user.publicExpiry) {
                    setExpiryDate(new Date(data.user.publicExpiry).toISOString().split('T')[0]);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const handleExtendExpiry = async () => {
        if (!expiryDate) return;
        setUpdating(true);
        try {
            const updates = {
                publicExpiry: new Date(expiryDate + 'T23:59:59').toISOString()
            };
            const response = await fetch('/api/admin/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, updates }),
            });

            if (response.ok) {
                onUpdate();
                onClose();
            } else {
                alert('Failed to update expiry');
            }
        } catch (error) {
            console.error('Error updating expiry:', error);
            alert('Error updating expiry');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    // Transform user data to match EscortProfile interface
    // We calculate "isGold", "isFeatured" etc. based on expiry dates relative to NOW.
    const now = new Date();
    const profileData = {
        ...user,
        isGold: user.goldExpiresAt ? new Date(user.goldExpiresAt) > now : false,
        isSilver: user.silverExpiresAt ? new Date(user.silverExpiresAt) > now : false,
        isFeatured: user.featuredExpiresAt ? new Date(user.featuredExpiresAt) > now : false,
        isTop: user.topExpiresAt ? new Date(user.topExpiresAt) > now : false,
        isNew: user.newExpiresAt ? new Date(user.newExpiresAt) > now : false,
        verifiedPhotos: user.verifiedPhotosExpiry ? new Date(user.verifiedPhotosExpiry) > now : false,
        // Ensure dateOfBirth is a Date object if needed, or string. EscortProfile accepts both.
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 flex-none">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Profile Verification</h2>
                        <p className="text-sm text-gray-500">Reviewing details for {user.name || user.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    {/* We wrap EscortProfileDisplay in a scaled wrapper or just let it be responsive. 
               It is responsive by default. 
               Note: EscortProfileDisplay tracks analytics on mount. 
               We might want to suppress that for admin views if possible, 
               but prop `isOwnProfile` disables view counting. 
               Let's pass isOwnProfile={true} to disable tracking, 
               even though it's not strictly "own" profile, it has same effect of no analytics.
               Wait, isOwnProfile also shows "Edit Profile" button. 
               We don't want that.
               We want NO analytics but NO edit button.
               Looking at EscortProfileDisplay:
               useEffect(() => { if (!isOwnProfile) { ... track view ... } }, ...)
               
               If we pass isOwnProfile=false (default), it counts a view. 
               That might be acceptable or we just ignore it. 
               Let's pass isOwnProfile={false} for accurate display (Report button etc matches public view).
           */}
                    <div className="pointer-events-none-wrapper">
                        {/* 
                We might want to disable some interactions or just let admin see it as user sees it.
                Let's show it exactly as is.
             */}
                        <EscortProfileDisplay profile={profileData} isOwnProfile={false} />
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="px-6 py-4 border-t bg-white flex-none flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Public Expiry:</span>
                        <div className="relative flex items-center w-full">
                            <Calendar className="absolute left-3 w-4 h-4 text-gray-500" />
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-48 [color-scheme:light] bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition w-full md:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExtendExpiry}
                            disabled={updating || !expiryDate}
                            className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? 'Saving...' : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Extend & Publish
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
