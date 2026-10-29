import type { FormEvent, ReactElement } from 'react';
import { useRef, useState } from 'react';
import { trackEvent } from './analytics';
import type { ContactErrors, ContactFields } from './contactValidation';
import { contactLimits, normalizeContactFields, validateContactFields } from './contactValidation';
import { navigate } from './router';

export const CONTACT_SUBMITTED_KEY = 'rshibak:contact-submitted';
const FALLBACK_EMAIL = 'rashil9955@gmail.com';

type Status = 'idle' | 'submitting' | 'error';

const fieldOrder: Array<keyof ContactFields> = ['name', 'email', 'message'];

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState('');
  const inFlight = useRef(false);
  const openedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = normalizeContactFields({
      name: data.get('name'),
      email: data.get('email'),
      message: data.get('message'),
    });
    const nextErrors = validateContactFields(fields);
    setErrors(nextErrors);
    setSubmitError('');

    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    inFlight.current = true;
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          website: data.get('website') ?? '',
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      const result: { ok?: boolean; error?: string; errors?: ContactErrors } | null = await response
        .json()
        .catch(() => null);

      if (response.ok && result?.ok) {
        trackEvent({ name: 'contact_form_submit_success' });
        try {
          window.sessionStorage.setItem(CONTACT_SUBMITTED_KEY, '1');
        } catch {
          // The thank-you page falls back to a neutral message without this flag.
        }
        navigate('/thank-you');
        return;
      }

      trackEvent({ name: 'contact_form_submit_error', params: { status: String(response.status) } });
      if (result?.errors) setErrors(result.errors);
      setSubmitError(
        result?.error ??
          `Something went wrong and your message wasn’t sent. Please try again in a moment, or email me at ${FALLBACK_EMAIL}.`,
      );
    } catch {
      trackEvent({ name: 'contact_form_submit_error', params: { status: 'network' } });
      setSubmitError(
        `I couldn’t reach the server, so your message wasn’t sent. Check your connection and try again, or email me at ${FALLBACK_EMAIL}.`,
      );
    }

    inFlight.current = false;
    setStatus('error');
  }

  const isSubmitting = status === 'submitting';

  return (
    <section className="entry-section contact-form-section" aria-labelledby="contact-form-heading">
      <h2 id="contact-form-heading" className="entry-section-label">
        Send a Message
      </h2>
      <p className="contact-intro">
        Have something interesting in mind? Let&rsquo;s talk. This goes straight to my inbox.
      </p>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <Field
          id="contact-name"
          name="name"
          label="Name"
          error={errors.name}
          input={(describedBy) => (
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={contactLimits.nameMax}
              required
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy}
              disabled={isSubmitting}
            />
          )}
        />
        <Field
          id="contact-email"
          name="email"
          label="Email"
          error={errors.email}
          input={(describedBy) => (
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={contactLimits.emailMax}
              required
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy}
              disabled={isSubmitting}
            />
          )}
        />
        <Field
          id="contact-message"
          name="message"
          label="Message"
          error={errors.message}
          input={(describedBy) => (
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              minLength={contactLimits.messageMin}
              maxLength={contactLimits.messageMax}
              required
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy}
              disabled={isSubmitting}
            />
          )}
        />

        {/* Honeypot: hidden from people and screen readers; bots tend to fill it in. */}
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="contact-actions">
          <button type="submit" className="contact-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
          <p className="contact-response-time">
            I usually respond within 2&ndash;3 business days, though now and then it takes a little
            longer.
          </p>
        </div>

        <p className="contact-status" role="alert">
          {submitError}
        </p>
      </form>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  error,
  input,
}: {
  id: string;
  name: keyof ContactFields;
  label: string;
  error?: string;
  input: (describedBy: string | undefined) => ReactElement;
}) {
  const errorId = `${id}-error`;

  return (
    <div className={`contact-field contact-field-${name}`}>
      <label htmlFor={id}>{label}</label>
      {input(error ? errorId : undefined)}
      {error ? (
        <p id={errorId} className="contact-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
