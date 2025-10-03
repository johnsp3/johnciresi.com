import React, { useState } from 'react';

interface NewsletterFormProps {
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

const NewsletterForm: React.FC<NewsletterFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    website: '', // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          website: formData.website, // Honeypot
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setMessage(
          result.message ||
            "Thank you for subscribing! You'll receive updates on new releases and exclusive content."
        );
        setMessageType('success');
        setFormData({ email: '', website: '' });

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
        console.error('Error in newsletter submission:', error);
      }
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex-1">
            <label
              htmlFor="newsletter-email"
              className="mb-4 block text-sm font-light uppercase tracking-[0.1em] text-white/80"
            >
              Email Address
            </label>
            <input
              type="email"
              id="newsletter-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-500 focus:border-white/40 focus:outline-none"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full whitespace-nowrap border border-white/20 bg-white px-12 py-4 text-sm font-medium uppercase tracking-[0.1em] text-black transition-all duration-500 hover:bg-white/95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </span>
              <div className="absolute inset-0 origin-center scale-0 bg-gradient-to-r from-white/20 to-white/10 transition-transform duration-500 group-hover:scale-100"></div>
            </button>
          </div>
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
      </form>
    </div>
  );
};

export default NewsletterForm;
