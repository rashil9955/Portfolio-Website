// Shared by the contact form (src/ContactForm.tsx) and the Worker (worker/index.ts),
// so the browser and the server apply exactly the same rules.

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const contactLimits = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
};

// Deliberately strict: no spaces, quotes, angle brackets, or line breaks,
// which also keeps the address safe to put in an email header.
const EMAIL_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function normalizeContactFields(input: Partial<Record<keyof ContactFields, unknown>>): ContactFields {
  const text = (value: unknown) => (typeof value === 'string' ? value : '');
  return {
    name: text(input.name).replace(/\s+/g, ' ').trim(),
    email: text(input.email).trim(),
    message: text(input.message).replace(/\r\n?/g, '\n').trim(),
  };
}

export function validateContactFields(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (!fields.name) {
    errors.name = 'Please tell me your name.';
  } else if (fields.name.length > contactLimits.nameMax) {
    errors.name = `Please keep your name under ${contactLimits.nameMax} characters.`;
  }

  if (!fields.email) {
    errors.email = 'I need an email address to reply to.';
  } else if (fields.email.length > contactLimits.emailMax || !EMAIL_PATTERN.test(fields.email)) {
    errors.email = 'That email address doesn’t look quite right.';
  }

  if (!fields.message) {
    errors.message = 'Don’t forget the message.';
  } else if (fields.message.length < contactLimits.messageMin) {
    errors.message = 'Could you say a little more? At least a sentence helps.';
  } else if (fields.message.length > contactLimits.messageMax) {
    errors.message = `Please keep it under ${contactLimits.messageMax.toLocaleString('en-US')} characters.`;
  }

  return errors;
}
