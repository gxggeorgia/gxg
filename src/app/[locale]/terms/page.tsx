import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('common');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="px-8 py-10 sm:px-12 sm:py-12">
                    <div className="border-b border-gray-200 pb-8 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Terms of Service</h1>
                        <p className="text-gray-500 text-sm font-medium">Last Updated: December 9, 2025</p>
                    </div>

                    <div className="prose prose-lg prose-slate max-w-none text-gray-700">
                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="leading-relaxed">
                                By accessing and using this website ("Site"), you accept and agree to be bound by the terms and provision of this agreement.
                                If you do not agree to abide by these terms, please do not use this Site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Age Restriction (18+)</h2>
                            <p className="leading-relaxed">
                                This Site contains adult-oriented content. You must be at least 18 years of age (or the age of majority in your jurisdiction) to access this Site.
                                By accessing this Site, you swear and affirm that you are over the age of 18 and that you are not accessing this Site from any jurisdiction where such content is illegal.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Nature of the Service</h2>
                            <p className="leading-relaxed">
                                This Site acts solely as a directory and advertising platform for independent advertisers. We are not an escort agency, employer, or broker.
                                We do not screen, interview, or employ any advertisers listed on this Site. We make no representations or warranties regarding the accuracy of the advertisements or the services offered by advertisers.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
                            <p className="leading-relaxed">
                                You agree to use this Site only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, scandalous, inflammatory, pornographic, or profane material.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Zero Tolerance Policy</h2>
                            <p className="leading-relaxed">
                                We have a zero-tolerance policy for child sexual abuse material (CSAM), human trafficking, and non-consensual sexual content.
                                Any content found to be in violation of this policy will be immediately removed, and the relevant authorities will be notified.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
                            <p className="leading-relaxed">
                                In no event shall the Site owners, administrators, or affiliates be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
                            <p className="leading-relaxed">
                                We reserve the right to modify these terms at any time. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Governing Law and Jurisdiction</h2>
                            <p className="leading-relaxed">
                                These Terms shall be governed and construed in accordance with the laws of <strong>Georgia</strong>, without regard to its conflict of law provisions.
                                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Youth Protection (Jugendschutz)</h2>
                            <p className="leading-relaxed">
                                In compliance with international standards and specifically the German Youth Protection Act (Jugendschutzgesetz - JuSchG):
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Access to this platform is strictly restricted to persons 18 years of age or older.</li>
                                <li>We employ age verification measures where required by law.</li>
                                <li>Any content depicting minors or suggesting the involvement of minors is strictly prohibited and will be reported to authorities immediately.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Impressum (Legal Notice)</h2>
                            <p className="leading-relaxed mb-2">
                                <em>Angaben gemäß § 5 TMG (Information according to § 5 TMG for German users):</em>
                            </p>
                            <p className="leading-relaxed">
                                <strong>Operator:</strong> GogoXGeorgia<br />
                                <strong>Contact:</strong> Please refer to the <strong>Contact</strong> page on our website.<br />
                                <strong>Nature of Service:</strong> Online Directory / Advertising Platform
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                            <p className="leading-relaxed">
                                If you have any questions about these Terms, please contact us via the support channels listed on the Site.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
