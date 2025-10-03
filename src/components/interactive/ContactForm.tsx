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
    website: '', // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website, // Honeypot
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setMessage(
          result.message ||
            "Thank you for your message! I'll get back to you soon."
        );
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
          setMessage(
            `Too many requests. Please try again in ${retryAfter} seconds.`
          );
        } else if (result.details && result.details.length > 0) {
          setMessage(result.details.join(', '));
        } else {
          setMessage(result.error || 'Something went wrong. Please try again.');
        }
        setMessageType('error');
      }
    } catch (error) {
      // Log error for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in contact form submission:', error);
      }
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-4 block text-sm font-light uppercase tracking-[0.1em] text-white/80"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-500 focus:border-white/40 focus:outline-none"
              placeholder="Your name"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-4 block text-sm font-light uppercase tracking-[0.1em] text-white/80"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-500 focus:border-white/40 focus:outline-none"
              placeholder="your@email.com"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-4 block text-sm font-light uppercase tracking-[0.1em] text-white/80"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={8}
            className="w-full resize-none border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-500 focus:border-white/40 focus:outline-none"
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
            <p
              className={`text-sm font-light ${
                messageType === 'success' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full border border-white/20 bg-white px-12 py-5 text-sm font-medium uppercase tracking-[0.1em] text-black transition-all duration-500 hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </span>
          <div className="absolute inset-0 origin-center scale-0 bg-gradient-to-r from-white/20 to-white/10 transition-transform duration-500 group-hover:scale-100"></div>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
