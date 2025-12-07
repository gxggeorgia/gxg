'use client';

import { X, CheckCircle, Star } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface RegistrationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationInfoModal({ isOpen, onClose }: RegistrationInfoModalProps) {
  const router = useRouter();
  const t = useTranslations('common');

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    router.push('/register');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('registerAsEscort') || 'Register as an Escort'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Subscription Packages */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">💎 {t('subscriptionPackages') || 'Subscription Packages'}</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('freeOneFeatured') || 'Free - 1 Month Featured'}</p>
                  <p className="text-sm text-gray-600">{t('getFeaturedFirstMonth') || 'Get featured for your first month'}</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Star size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('vipPass') || 'VIP Pass'}</p>
                  <p className="text-sm text-gray-600">{t('vipPassDesc') || 'Premium visibility and features'}</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Star size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{t('eliteVipPass') || 'Elite VIP Pass'}</p>
                  <p className="text-sm text-gray-600">{t('eliteVipPassDesc') || 'Maximum visibility and exclusive features'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Process */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('verificationProcess') || 'Verification Process'}</h3>
            <p className="text-gray-700 mb-3">{t('afterRegistrationVerify') || 'After registration, you\'ll need to verify your account:'}</p>
            <ol className="space-y-2 ml-4">
              <li className="text-gray-700"><strong>1.</strong> {t('submitPhotosWithId') || 'Submit clear photos with your ID'}</li>
              <li className="text-gray-700"><strong>2.</strong> {t('sendVerificationTelegram') || 'Send verification to our Telegram channel'}</li>
              <li className="text-gray-700"><strong>3.</strong> {t('waitAdminApproval') || 'Wait for admin approval (24-48 hours)'}</li>
              <li className="text-gray-700"><strong>4.</strong> {t('profileGoesLive') || 'Your profile goes live!'}</li>
            </ol>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            {t('cancel') || 'Cancel'}
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            {t('continueRegistration') || 'Continue to Registration'}
          </button>
        </div>
      </div>
    </>
  );
}
