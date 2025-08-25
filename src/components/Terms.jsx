"use client"

import React from 'react';
import Link from 'next/link';

const Terms = () => {
    window.scrollTo({ top: 0, category: "top" })
    return (
        <div className="lg:mx-15 px-4 py-8">
            <p className="text-[#0D3F6A] lg:text-4xl text-2xl font-bold mb-6  lg:text-center md:text-center">TERMS AND CONDITIONS</p>

            <div className="mb-8">
                <p className="text-gray-700 mb-4">
                    Welcome to mybestvenue ("we", "us", or "our"). These Terms and Conditions form a legally binding agreement between you (the user or customer) and us, governing your access to and use of our website and services related to event planning, venue booking, vendor coordination, and other related offerings.
                </p>
                <p className="text-gray-700 mb-4">
                    By visiting, browsing, or using any part of this website or its services, you are agreeing to all the terms outlined below. If you do not agree with any part of these Terms, you should not proceed with using this website or our services.
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h3>
                <div className="text-gray-700 space-y-4">
                    <p>When you access or use our website or services, you are entering into a legal agreement with us. This means that you accept and agree to be bound by these Terms and Conditions, as well as any additional guidelines, rules, or policies we may publish from time to time.</p>
                    <p>You must be at least 18 years old to enter into such an agreement. By continuing to use the site, you confirm that you meet this requirement and that you understand and agree to be bound by these Terms.</p>
                    <p>These Terms apply to everyone who uses the website — whether you're simply browsing, registering for an account, or booking events through the platform.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">2. Use of the Website</h3>
                <div className="text-gray-700 space-y-4">
                    <p>We provide access to our website so that users can browse, search, book, and manage events and related services. We grant you a limited, non-exclusive, revocable, and non-transferable license to use the website for personal, non-commercial purposes related to event planning.</p>
                    <p>However, there are certain things you must not do:</p>
                    <ul className="list-disc ml-6">
                        <li>You cannot use the website for any purpose that is illegal or violates any laws.</li>
                        <li>You cannot copy, modify, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the website.</li>
                        <li>You cannot interfere with the proper functioning of the website or disrupt any activity taking place on it.</li>
                        <li>You cannot attempt to gain unauthorized access to any portion of the website, or any systems or networks connected to it.</li>
                        <li>You cannot upload, post, email, or otherwise transmit any content that contains viruses, worms, Trojan horses, or any other harmful code.</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">3. Registration and Account Responsibilities</h3>
                <div className="text-gray-700 space-y-4">
                    <p>To access some features of the website — such as booking venues, messaging vendors, or saving preferences — you may need to register and create an account.</p>
                    <p>During registration, you agree to provide accurate, current, and complete information about yourself. It is your responsibility to keep this information up to date.</p>
                    <p>Once you have an account:</p>
                    <ul className="list-disc ml-6">
                        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                        <li>You are fully responsible for all activities that occur under your account.</li>
                        <li>If you suspect that someone has accessed your account without permission, you must immediately notify us.</li>
                        <li>We reserve the right to suspend or terminate your account if we believe that you have violated these Terms or engaged in fraudulent, abusive, or inappropriate behaviour.</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">4. Event Booking and Payment Policy</h3>
                <div className="text-gray-700 space-y-4">
                    <p>All bookings made through the website are subject to availability and confirmation by us. A booking will only be considered confirmed after full payment or applicable deposit has been received, depending on the type of service selected.</p>
                    <p>We accept various modes of payment, including:</p>
                    <ul className="list-disc ml-6">
                        <li>UPI</li>
                        <li>Bank Transfer</li>
                        <li>Credit/Debit Card</li>
                        <li>Cash</li>
                        <li>Any other method we may specify</li>
                    </ul>
                    <p>Payment in full must be made at least 3 days before the event, unless otherwise agreed upon in writing. If payment is not received on time, the booking may be cancelled without further notice.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">5. Cancellation and Refund Policy</h3>
                <div className="text-gray-700 space-y-4">
                    <p>Refunds are processed based on how much time is left before the event:</p>
                    <ul className="list-disc ml-6">
                        <li>If you cancel more than 7 days before the event, you will receive a full refund (100%).</li>
                        <li>If you cancel between 4–7 days before the event, you will receive a 50% refund.</li>
                        <li>If you cancel less than 4 days before the event, no refund will be issued.</li>
                    </ul>
                    <p>Refunds will be processed within 7 business days of cancellation.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h3>
                <div className="text-gray-700 space-y-4">
                    <p>The website and all its contents are provided on an "as is" and "as available" basis. While we strive to offer a reliable and functional service, we make no warranties, express or implied, regarding the operation of the website or the accuracy, completeness, or reliability of any content found on it.</p>
                    <p>We are not liable for any damages of any kind — including direct, indirect, incidental, punitive, or consequential damages — arising from your use of the website or inability to use it.</p>
                    <p>Additionally, we are not responsible for:</p>
                    <ul className="list-disc ml-6">
                        <li>Failures or delays caused by third-party vendors or partners.</li>
                        <li>Technical issues, internet outages, or system errors.</li>
                        <li>Events cancelled due to force majeure circumstances.</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h3>
                <div className="text-gray-700 space-y-4">
                    <p>All content on this website — including text, graphics, logos, images, videos, and software — is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                    <p>You are not allowed to:</p>
                    <ul className="list-disc ml-6">
                        <li>Modify, copy, reproduce, republish, upload, post, transmit, or distribute any content from the website without prior written permission.</li>
                        <li>Use any of our trademarks or logos without authorization.</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">8. Governing Law and Jurisdiction</h3>
                <div className="text-gray-700 space-y-4">
                    <p>These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India.</p>
                    <p>Any dispute arising from or related to these Terms will be resolved in the courts located in New Delhi, India.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">9. Changes to These Terms</h3>
                <div className="text-gray-700 space-y-4">
                    <p>We may update or change these Terms and Conditions at any time to reflect changes in our services, legal requirements, or other factors.</p>
                    <p>When we make changes, we will update the "Last Updated" date at the top of this page. Your continued use of the website after any such changes indicates your acceptance of the new Terms.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">10. Force Majeure</h3>
                <div className="text-gray-700 space-y-4">
                    <p>We are not responsible for any failure or delay in performing our obligations under these Terms due to causes beyond our reasonable control. These include but are not limited to:</p>
                    <ul className="list-disc ml-6">
                        <li>Acts of God (e.g., earthquakes, floods)</li>
                        <li>War or terrorism</li>
                        <li>Strikes or labour disputes</li>
                        <li>Power outages</li>
                        <li>Pandemics or government restrictions</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">11. Termination</h3>
                <div className="text-gray-700 space-y-4">
                    <p>We reserve the right to suspend or terminate your account or deny access to the website at any time, without notice or liability, for any reason, including if we believe that you have violated these Terms.</p>
                    <p>Upon termination, your right to use the website ends immediately. We also reserve the right to remove or disable access to any content you have uploaded or posted that we determine violates these Terms.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">12. Indemnification</h3>
                <div className="text-gray-700 space-y-4">
                    <p>You agree to defend, indemnify, and hold harmless mybestvenue, its affiliates, officers, directors, employees, agents, and suppliers from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:</p>
                    <ul className="list-disc ml-6">
                        <li>Your access to or use of the website.</li>
                        <li>Your violation of these Terms.</li>
                        <li>Your infringement of any third-party rights, including intellectual property rights.</li>
                    </ul>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">13. Severability</h3>
                <div className="text-gray-700 space-y-4">
                    <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. The invalid provision will be replaced with one that closely reflects the original intent.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">14. Entire Agreement</h3>
                <div className="text-gray-700 space-y-4">
                    <p>These Terms and Conditions, along with our Privacy Policy and any other documents referenced herein, constitute the entire agreement between you and us regarding the use of the website.</p>
                    <p>They replace all previous agreements, understandings, or communications between us, whether written or oral, about the same subject matter.</p>
                </div>
            </div>

            <footer className="mt-12 text-gray-600 border-t pt-8">
                <div className="text-center space-y-2">
                    <p>D-9, Vyapar Marg, Block D, Sector-3, Noida, Uttar Pradesh-201301</p>
                    <p>
                        <Link href="tel:9990058522" style={{textDecoration:'none',}} className="text-[#0D3F6A] hover:text-[#0D3F6A] ">9990058522</Link> |{' '}
                        <Link href="mailto:Info@dsyhospitality.com" style={{textDecoration:'none'}} className="text-[#0D3F6A] hover:text-[#0D3F6A]">Info@dsyhospitality.com</Link> |{' '}
                        <Link href="http://www.dsyhospitality.com" style={{textDecoration:'none'}} className="text-[#0D3F6A] hover:text-[#0D3F6A]" target="_blank" rel="noopener noreferrer">www.dsyhospitality.com</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Terms;