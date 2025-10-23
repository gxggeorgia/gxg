'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CheckCircle, Send, MessageCircle, ArrowLeft } from 'lucide-react';

export default function VerifyPage() {
  const t = useTranslations();
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_MAIL_ADDRESS ||
    process.env.CONTACT_MAIL_ADDRESS ||
    'support@example.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-3 md:px-4">

        {/* Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden mb-4 md:mb-6 border border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-6 md:px-8 md:py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t('common.getVerified')}
            </h1>
            <p className="text-green-100 text-lg">
              {t('common.increaseCredibility')}
            </p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className=" rounded-2xl p-2 md:p-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <Send size={24} className="text-blue-600 md:w-7 md:h-7" />
            {t('common.verificationProcess')}
          </h2>

          <div className="space-y-4 md:space-y-6">
            {/* Step 1 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                  {t('common.preparePhotos')}
                </h3>
                <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3">
                  {t('common.preparePhotosDesc')}
                </p>
                <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-1 ml-2 md:ml-4">
                  <li>{t('common.faceVisible')}</li>
                  <li>{t('common.idReadable')}</li>
                  <li>{t('common.faceAndId')}</li>
                  <li>{t('common.wellLit')}</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                  {t('common.sendToTelegram')}
                </h3>
                <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3">
                  {t('common.sendToTelegramDesc')}
                </p>
                <a
                  href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition shadow-md"
                >
                  <MessageCircle size={18} className="md:w-5 md:h-5" />
                  {t('common.openTelegramChannel')}
                </a>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base md:text-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                  {t('common.waitForVerification')}
                </h3>
                <p className="text-sm md:text-base text-gray-700">
                  {t('common.waitForVerificationDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-6 md:mt-8 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3 flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {t('common.importantNotes')}
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-amber-900">
              <li className="flex gap-2">
                <span>•</span>
                <span>{t('common.infoConfidential')}</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>{t('common.verificationFree')}</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>{t('common.verifiedHigherVisibility')}</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>{t('common.dontSharePhotos')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="mt-6 text-center mb-20 md:mb-6">
            <p className="text-gray-600">
              {t('common.needHelp')}{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {contactEmail}
              </a>
            </p>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 md:p-3 z-50">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Link
              href="/profile"
              className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg font-semibold transition text-xs md:text-sm"
            >
              <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="truncate">{t('common.backToProfile')}</span>
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2.5 md:px-4 md:py-3 rounded-lg font-semibold transition text-xs md:text-sm"
            >
              <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="truncate">{t('common.openTelegramChannel')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
