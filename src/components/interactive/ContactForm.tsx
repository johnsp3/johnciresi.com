import React, { useState } from 'react';

interface ContactFormProps {
  className?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string[];
  remaining?: number;
  retryAfter?: number;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('website', formData.website); // Honeypot

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setMessage(result.message || 'Thank you for your message! I\'ll get back to you soon.');
        setMessageType('success');
        setFormData({ name: '', email: '', message: '', website: '' });
        
        // Hide message after 8 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 8000);
      } else {
        if (response.status === 429) {
          const retryAfter = result.retryAfter || 15;
          setMessage(`Too many requests. Please try again in ${retryAfter} seconds.`);
        } else if (result.details && result.details.length > 0) {
          setMessage(result.details.join(', '));
        } else {
          setMessage(result.error || 'Something went wrong. Please try again.');
        }
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error in contact form submission:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <label htmlFor="name" className="block text-sm font-light tracking-[0.1em] text-white/80 mb-4 uppercase">
              Name
            </label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-500 backdrop-blur-sm" 
              placeholder="Your name"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-light tracking-[0.1em] text-white/80 mb-4 uppercase">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-500 backdrop-blur-sm" 
              placeholder="your@email.com"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-light tracking-[0.1em] text-white/80 mb-4 uppercase">
            Message
          </label>
          <textarea 
            id="message" 
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={8} 
            className="w-full px-6 py-4 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-all duration-500 resize-none backdrop-blur-sm" 
            placeholder="Your message"
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        
        {/* Success/Error Messages */}
        {message && (
          <div className="text-center">
            <p className={`font-light text-sm ${
              messageType === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-12 py-5 bg-white text-black font-medium tracking-[0.1em] uppercase text-sm hover:bg-white/95 transition-all duration-500 border border-white/20 relative group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
