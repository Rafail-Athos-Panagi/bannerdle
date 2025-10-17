'use client';

import React, { useState, useEffect } from 'react';
import MedievalNavbar from '@/components/MedievalNavbar';
import PageRefreshLoader from '@/components/PageRefreshLoader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Generate CSRF token and session ID on component mount
  useEffect(() => {
    const generateToken = () => {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    };
    
    setCsrfToken(generateToken());
    setSessionId(generateToken());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error message when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
          'x-session-id': sessionId
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Generate new CSRF token after successful submission
        const generateToken = () => {
          return Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
        };
        setCsrfToken(generateToken());
        setSessionId(generateToken());
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to send message');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageRefreshLoader loadingMessage="Preparing your message...">
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <MedievalNavbar />
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center text-[var(--bannerlord-custom-light-cream)] pt-16 pb-8">
          <div className="max-w-4xl mx-auto px-4 w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-4 font-serif" style={{ 
                textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.6)'
              }}>
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-[var(--bannerlord-custom-light-cream)] opacity-80">
                Send your message to the realm of Calradia
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Contact Information Card */}
              <div className="bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-90 rounded-lg p-6 border-2 border-[var(--bannerlord-custom-med-brown)]" style={{
                backdropFilter: 'blur(2px)'
              }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="var(--bannerlord-custom-very-dark-brown)"
                      className="w-8 h-8"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-2">
                    Send a Message
                  </h3>
                  <p className="text-[var(--bannerlord-custom-light-cream)] opacity-80">
                    Reach out to us with your questions, feedback, or suggestions
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--bannerlord-custom-med-brown)] rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="var(--bannerlord-patch-brassy-gold)"
                        className="w-4 h-4"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[var(--bannerlord-custom-light-cream)] font-semibold">Email</p>
                      <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-sm">bannerdledev@gmail.com</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Support Card */}
              <div className="bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-90 rounded-lg p-6 border-2 border-[var(--bannerlord-custom-med-brown)]" style={{
                backdropFilter: 'blur(2px)'
              }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[var(--bannerlord-patch-brassy-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      viewBox="0 0 24 24"
                      fill="var(--bannerlord-custom-very-dark-brown)"
                      className="w-8 h-8"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-2">
                    Support Development
                  </h3>
                  <p className="text-[var(--bannerlord-custom-light-cream)] opacity-80">
                    Help us continue improving Bannerdle
                    <br />
                    <br />
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--bannerlord-custom-med-brown)] rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="var(--bannerlord-patch-brassy-gold)"
                        className="w-4 h-4"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[var(--bannerlord-custom-light-cream)] font-semibold">Ko-fi</p>
                      <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-sm">Support with a donation</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[var(--bannerlord-custom-very-dark-brown)] bg-opacity-90 rounded-lg p-6 border-2 border-[var(--bannerlord-custom-med-brown)] mb-8" style={{
              backdropFilter: 'blur(2px)'
            }}>
              <h3 className="text-2xl font-bold text-[var(--bannerlord-patch-brassy-gold)] mb-6 text-center">
                Send Your Message
              </h3>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="bg-green-900 bg-opacity-50 border-2 border-green-600 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-green-400 font-semibold">Message sent successfully!</p>
                    </div>
                    <p className="text-green-300 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-red-900 bg-opacity-50 border-2 border-red-600 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-400 font-semibold">Failed to send message</p>
                    </div>
                    <p className="text-red-300 text-sm mt-1">{errorMessage}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                      placeholder="Enter your name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      maxLength={254}
                      className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    maxLength={200}
                    className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                    placeholder="What's this about?"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                    Message * (min. 10 characters)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200 resize-vertical"
                    placeholder="Tell us what's on your mind..."
                    disabled={isSubmitting}
                  />
                  <div className="text-right text-sm text-[var(--bannerlord-custom-light-cream)] opacity-50 mt-1">
                    {formData.message.length}/5000 characters
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.message.length < 10}
                    className="px-8 py-3 bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold rounded-lg hover:bg-[var(--bannerlord-patch-gold-text)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-[var(--bannerlord-custom-very-dark-brown)] border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageRefreshLoader>
  );
}
