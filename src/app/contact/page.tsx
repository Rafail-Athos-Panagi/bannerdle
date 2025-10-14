import React from 'react';
import MedievalNavbar from '@/components/MedievalNavbar';
import PageRefreshLoader from '@/components/PageRefreshLoader';

export default function ContactPage() {
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
                      <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-sm">contact@bannerlordquest.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--bannerlord-custom-med-brown)] rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="var(--bannerlord-patch-brassy-gold)"
                        className="w-4 h-4"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[var(--bannerlord-custom-light-cream)] font-semibold">Response Time</p>
                      <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-sm">Within 24 hours</p>
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
                    Help us continue improving Bannerlord Quest
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

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--bannerlord-custom-med-brown)] rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="var(--bannerlord-patch-brassy-gold)"
                        className="w-4 h-4"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[var(--bannerlord-custom-light-cream)] font-semibold">GitHub</p>
                      <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70 text-sm">Report bugs & suggest features</p>
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
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[var(--bannerlord-custom-light-cream)] font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-[var(--bannerlord-custom-dark-brown)] border-2 border-[var(--bannerlord-custom-med-brown)] rounded-lg text-[var(--bannerlord-custom-light-cream)] placeholder-[var(--bannerlord-custom-light-cream)] placeholder-opacity-50 focus:border-[var(--bannerlord-patch-brassy-gold)] focus:outline-none transition-colors duration-200 resize-vertical"
                    placeholder="Tell us what's on your mind..."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[var(--bannerlord-patch-brassy-gold)] text-[var(--bannerlord-custom-very-dark-brown)] font-bold rounded-lg hover:bg-[var(--bannerlord-patch-gold-text)] transition-all duration-300 hover:scale-105 shadow-lg border-2 border-[var(--bannerlord-custom-med-brown)]"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Message */}
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent opacity-50"></div>
                <div className="text-[var(--bannerlord-patch-brassy-gold)] text-sm">⚔️</div>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--bannerlord-patch-brassy-gold)] to-transparent opacity-50"></div>
              </div>
              <p className="text-[var(--bannerlord-custom-light-cream)] opacity-70">
                Your voice matters in the realm of Calradia. We look forward to hearing from you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageRefreshLoader>
  );
}
