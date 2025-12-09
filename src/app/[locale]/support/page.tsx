'use client';

import { useTranslations } from 'next-intl';
import { Mail, MessageCircle } from 'lucide-react';

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_MAIL_ADDRESS || 'contact@escortgeorgia.com';
const TELEGRAM_LINK = process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/escortgeorgia';
const TELEGRAM_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || '@escortgeorgia';

export default function SupportPage() {
  const t = useTranslations('support');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('emailSupport')}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {t('emailDesc')}
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Telegram Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('telegram')}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {t('telegramDesc')}
                </p>
                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {TELEGRAM_USERNAME}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t('faqTitle')}</h2>
          <div className="space-y-6">
            {[
              {
                question: t('faq1Q'),
                answer: t('faq1A')
              },
              {
                question: t('faq2Q'),
                answer: t('faq2A')
              },
              {
                question: t('faq3Q'),
                answer: t('faq3A')
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}