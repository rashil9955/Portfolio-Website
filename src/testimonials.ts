// Testimonials from people who have actually worked with Rashil.
// The section stays hidden while this list is empty. Only add real quotes,
// shared with permission, exactly as the person wrote them.
//
// Example shape (do not uncomment with made-up details):
// {
//   quote: 'Their exact words.',
//   name: 'Full Name',
//   role: 'Their title',
//   organization: 'Where you worked together',
//   relationship: 'Supervised Rashil at …',
//   href: 'https://www.linkedin.com/in/…', // optional link to the source
// },

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  organization?: string;
  relationship?: string;
  href?: string;
};

export const testimonials: Testimonial[] = [];
