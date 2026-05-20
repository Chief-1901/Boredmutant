// Central config — edit these two values to repoint the entire site.

export const EMAIL = "contact@boredmutant.com";

// Public booking page URL. Works with any scheduling tool:
//   - Cal.com (recommended — free, unbranded, unlimited event types)
//     https://cal.com/[handle]                  — profile page (shows all event types)
//     https://cal.com/[handle]/[event-slug]     — direct link to one event (one fewer click)
//   - Calendly:        https://calendly.com/your-handle/intro-call
//   - SavvyCal:        https://savvycal.com/your-handle/intro-call
//   - Zoho Bookings:   https://[workspace].zohobookings.com/#/[service-id]
//   - Google Appointment Schedule, Microsoft Bookings, etc.
//
// If left empty (""), every "Book a 15-minute call" button falls back to a
// pre-subjected mailto link to EMAIL above.
export const BOOKING_URL = "https://cal.com/boredmutant";

const MAILTO_SUBJECT = encodeURIComponent("Automation — intro call");

export const CTA_HREF = BOOKING_URL || `mailto:${EMAIL}?subject=${MAILTO_SUBJECT}`;
export const EMAIL_HREF = `mailto:${EMAIL}?subject=${MAILTO_SUBJECT}`;

export const CTA_IS_EXTERNAL = Boolean(BOOKING_URL);
