import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const HCAPTCHA_SITE_KEY =
  (import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined) ??
  '10000000-ffff-ffff-ffff-000000000001'; // hCaptcha test key

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  _honeypot: z.string().max(0),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="field-error" role="alert">
      {message}
    </p>
  ) : null;

const ContactPage = () => {
  const statusRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const pendingData = useRef<ContactFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { _honeypot: '' },
  });

  const submitData = async (data: ContactFormData, captchaToken: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.functions.invoke('submit-contact', {
      body: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        captchaToken,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError('Unable to send your message. Please try again or email us directly.');
      captchaRef.current?.resetCaptcha();
      return;
    }

    setSubmitted(true);
    setTimeout(() => statusRef.current?.focus(), 50);
  };

  const onCaptchaVerify = (token: string) => {
    const data = pendingData.current;
    if (data) {
      pendingData.current = null;
      void submitData(data, token);
    }
  };

  const onSubmit = (data: ContactFormData) => {
    if (data._honeypot) return;
    pendingData.current = data;
    captchaRef.current?.execute();
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Maharaja Restaurant. Find our address at 456 Spice Avenue, Delhi, call +91 98765 43210, or send us a message online."
        canonicalPath="/contact"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-[#7A5C00] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <address className="not-italic text-gray-600">
                      456 Spice Avenue
                      <br />
                      Delhi, India 110001
                    </address>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-[#7A5C00] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a
                      href="tel:+919876543210"
                      className="text-gray-600 hover:text-[#7A5C00] transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-[#7A5C00] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href="mailto:contact@maharajarestaurant.in"
                      className="text-gray-600 hover:text-[#7A5C00] transition-colors"
                    >
                      contact@maharajarestaurant.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-[#7A5C00] mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-gray-600">
                      Monday – Sunday
                      <br />
                      Lunch: 12:00 PM – 3:00 PM
                      <br />
                      Dinner: 6:00 PM – 11:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-64 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043435559!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Maharaja Restaurant Location on Google Maps"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <div aria-live="polite" aria-atomic="true">
                {submitted && (
                  <div
                    ref={statusRef}
                    tabIndex={-1}
                    className="text-center py-8 focus:outline-none"
                  >
                    <h3 className="text-xl font-semibold text-[#7A5C00] mb-4">Thank You!</h3>
                    <p className="text-gray-600 mb-6">
                      We've received your message and will get back to you soon.
                    </p>
                    <button
                      onClick={() => {
                        reset();
                        setSubmitted(false);
                      }}
                      className="btn-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>

              {!submitted && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  {/* Honeypot */}
                  <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="contact-honeypot">Leave this blank</label>
                    <input
                      id="contact-honeypot"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register('_honeypot')}
                    />
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                    >
                      {submitError}
                      <button
                        type="submit"
                        className="ml-2 underline hover:no-underline"
                        onClick={() => {
                          setSubmitError(null);
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      aria-required="true"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                      {...register('name')}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      aria-required="true"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                      {...register('email')}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      aria-required="true"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                      {...register('subject')}
                    />
                    <FieldError message={errors.subject?.message} />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      aria-required="true"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                      {...register('message')}
                    />
                    <FieldError message={errors.message?.message} />
                  </div>

                  <HCaptcha
                    sitekey={HCAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={captchaRef}
                    onVerify={onCaptchaVerify}
                    onError={() => setSubmitError('CAPTCHA failed. Please try again.')}
                  />

                  <button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
