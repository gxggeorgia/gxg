import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo' });

    return generatePageMetadata(
        t('privacyTitle'),
        t('privacyDesc'),
        '/privacy',
        undefined,
        false,
        locale
    );
}

export default function PrivacyPage() {
    const t = useTranslations('common');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="px-8 py-10 sm:px-12 sm:py-12">
                    <div className="border-b border-gray-200 pb-8 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-500 text-sm font-medium">Last Updated: December 9, 2025</p>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-gray-700">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="leading-relaxed mb-4">
                                We collect minimal information necessary to provide our services. This may include:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Information you voluntarily provide when creating an account (email, username).</li>
                                <li>Content you upload to your profile (photos, descriptions).</li>
                                <li>Technical data such as IP address, browser type, and device information for security and analytics purposes.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="leading-relaxed mb-4">
                                We use the collected information to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Operate and maintain the Site.</li>
                                <li>Verify accounts and prevent fraud.</li>
                                <li>Improve user experience and site performance.</li>
                                <li>Comply with legal obligations.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Cookies and Tracking</h2>
                            <p className="leading-relaxed">
                                We use cookies to enhance your experience, such as keeping you logged in and remembering your preferences.
                                We may also use third-party analytics tools (like Google Analytics) to understand how our Site is used. These tools may collect anonymous data about your visit.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
                            <p className="leading-relaxed">
                                We do not sell, trade, or rent your personal identification information to others.
                                We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and advertisers.
                                We will only disclose personal information if required by law or to protect our rights and safety.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="leading-relaxed">
                                We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                                However, no data transmission over the Internet can be guaranteed to be 100% secure.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Third-Party Websites</h2>
                            <p className="leading-relaxed">
                                Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties.
                                We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                            <p className="leading-relaxed">
                                You have the right to access, correct, or delete your personal information. You can update your profile information directly through your account settings.
                                If you wish to delete your account, please contact support.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">8. International Users (GDPR & Georgia Law)</h2>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Users in the European Union (Germany)</h3>
                            <p className="leading-relaxed mb-4">
                                If you are a resident of the European Union, specifically Germany, you have the following rights under the General Data Protection Regulation (GDPR):
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
                                <li><strong>Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                                <li><strong>Right to Erasure:</strong> You have the right to request that we erase your personal data ("Right to be Forgotten").</li>
                                <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
                                <li><strong>Right to Object to Processing:</strong> You have the right to object to our processing of your personal data.</li>
                                <li><strong>Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Users in Georgia</h3>
                            <p className="leading-relaxed mb-4">
                                Our data processing practices are designed to comply with the "Law of Georgia on Personal Data Protection". We ensure that:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Personal data is processed fairly and lawfully.</li>
                                <li>Data is collected for specific, clear, and legitimate purposes.</li>
                                <li>Data is accurate and kept up to date.</li>
                                <li>Data is kept securely to prevent unauthorized access or loss.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Data Controller</h2>
                            <p className="leading-relaxed">
                                For the purposes of GDPR and Georgian data protection laws, the Data Controller is:<br />
                                <strong>GogoXGeorgia Administration</strong><br />
                                Please refer to the <strong>Contact</strong> page on our website for full contact details.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                            <p className="leading-relaxed">
                                We have the discretion to update this privacy policy at any time. We encourage Users to frequently check this page for any changes.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
