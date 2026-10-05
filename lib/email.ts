import { siteConfig } from "@/config/site";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EnquiryEmailData {
  referenceNo: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate?: Date | string | null;
  travelersCount: number;
  budgetRange?: string | null;
  travelType?: string | null;
  message: string;
  isCallback?: boolean;
  preferredCallbackTime?: string | null;
  createdAt?: Date | string;
}

/**
 * Dispatch email via Resend or configured provider
 * Safe against missing API keys, never exposing credentials to client
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "Sah Tour And Travel <onboarding@resend.dev>";

  if (!apiKey) {
    // Development / Mock mode when API key is not configured in environment
    console.log("----------------------------------------------------------------");
    console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${fromEmail}`);
    console.log(`Reply-To: ${replyTo || "none"}`);
    console.log("----------------------------------------------------------------");
    return {
      success: true,
      id: `sim_${Date.now()}`,
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Email Provider Error]", data);
      return { success: false, error: data.message || "Failed to send email via provider" };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("[Email Send Exception]", error?.message || error);
    return { success: false, error: error?.message || "Internal email transmission error" };
  }
}

/**
 * 1. Customer Confirmation Email
 */
export async function sendCustomerEnquiryConfirmation(data: EnquiryEmailData) {
  const travelDateFormatted = data.travelDate
    ? new Date(data.travelDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Flexible Dates";

  const helplineText = siteConfig.contact.helpline;
  const supportEmail = siteConfig.contact.email;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Enquiry Confirmation - Sah Tour And Travel</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #0a111a; padding: 32px 24px; text-align: center; border-bottom: 3px solid #e09f2b; }
        .logo { font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; }
        .logo-gold { color: #e09f2b; }
        .badge { display: inline-block; background: rgba(224, 159, 43, 0.15); color: #f0b54d; border: 1px solid rgba(224, 159, 43, 0.3); font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; margin-top: 8px; }
        .content { padding: 32px 24px; }
        .ref-box { background: #f1f5f9; border-left: 4px solid #0a111a; padding: 14px 18px; border-radius: 8px; margin: 20px 0; }
        .ref-id { font-family: monospace; font-size: 16px; font-weight: 800; color: #0a111a; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .details-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .details-table td.label { color: #64748b; font-weight: 600; width: 40%; }
        .details-table td.value { color: #0f172a; font-weight: 700; }
        .message-box { background: #fffaf0; border: 1px solid #fef3c7; border-radius: 10px; padding: 16px; margin: 18px 0; font-size: 13px; color: #92400e; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .contact-pill { display: inline-block; background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 9999px; margin: 4px; font-weight: 600; color: #0f172a; font-size: 11px; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SAH <span class="logo-gold">TOUR & TRAVEL</span></div>
          <div class="badge">Official Travel Enquiry Logged</div>
        </div>
        <div class="content">
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0;">Namaste, ${data.name}!</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Thank you for trusting Sah Tour And Travel with your upcoming holiday plans. We have successfully logged your travel inquiry. A dedicated destination concierge will review your preferences and prepare a customized itinerary within <strong>4 business hours</strong>.
          </p>

          <div class="ref-box">
            <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Your Enquiry Reference Number</span>
            <span class="ref-id">${data.referenceNo}</span>
          </div>

          <h3 style="font-size: 14px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; color: #0f172a; margin-top: 24px; margin-bottom: 8px;">Itinerary Overview</h3>
          <table class="details-table">
            <tr>
              <td class="label">Destination:</td>
              <td class="value">${data.destination}</td>
            </tr>
            <tr>
              <td class="label">Travel Date:</td>
              <td class="value">${travelDateFormatted}</td>
            </tr>
            <tr>
              <td class="label">Number of Travellers:</td>
              <td class="value">${data.travelersCount} Traveller(s)</td>
            </tr>
            ${data.budgetRange ? `
            <tr>
              <td class="label">Budget Range:</td>
              <td class="value">${data.budgetRange}</td>
            </tr>` : ""}
            ${data.travelType ? `
            <tr>
              <td class="label">Travel Style:</td>
              <td class="value">${data.travelType}</td>
            </tr>` : ""}
            <tr>
              <td class="label">Contact Phone:</td>
              <td class="value">${data.phone}</td>
            </tr>
          </table>

          <div class="message-box">
            <strong>Your Specific Requests:</strong><br>
            "${data.message}"
          </div>

          <div style="background: #effbfd; border: 1px solid #d6f2f7; padding: 14px; border-radius: 10px; font-size: 12px; color: #0d8294; margin-top: 20px;">
            <strong>Sah Transparency Assurance:</strong> All our quoted tour itineraries include clear, itemized inclusions, accredited operator hotel licenses, and official tourism citations. Zero hidden surcharges.
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #334155;">Need Immediate Travel Assistance?</p>
          <div>
            <span class="contact-pill">${helplineText}</span>
            <span class="contact-pill">${supportEmail}</span>
          </div>
          <p style="margin-top: 14px; font-size: 10px; color: #94a3b8;">
            © ${new Date().getFullYear()} Sah Tour And Travel. All rights reserved. Registered commercial travel service provider.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.email,
    subject: `Enquiry Received: ${data.referenceNo} - ${data.destination} | Sah Tour And Travel`,
    html,
    replyTo: supportEmail,
  });
}

/**
 * 2. Business Notification Email
 */
export async function sendBusinessEnquiryNotification(data: EnquiryEmailData) {
  const businessEmail =
    process.env.BUSINESS_ENQUIRY_EMAIL ||
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ||
    siteConfig.contact.email ||
    "inquiry@sahtourandtravel.com";

  const travelDateFormatted = data.travelDate
    ? new Date(data.travelDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Flexible / Not Specified";

  const isCallbackNotice = Boolean(data.isCallback);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Travel Lead - ${data.referenceNo}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; padding: 20px; color: #1e293b; }
        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #cbd5e1; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .tag-lead { background: #dbeafe; color: #1e40af; }
        .tag-callback { background: #fee2e2; color: #991b1b; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
        td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
        td.h { color: #64748b; font-weight: 600; width: 35%; }
        td.v { color: #0f172a; font-weight: 700; }
        .msg { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-top: 16px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="tag ${isCallbackNotice ? "tag-callback" : "tag-lead"}">
            ${isCallbackNotice ? "⚡ Urgent Callback Request" : "New Verified Travel Enquiry"}
          </span>
          <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #64748b;">
            Ref: ${data.referenceNo}
          </span>
        </div>

        <h2 style="font-size: 20px; margin: 16px 0 6px 0; color: #0f172a;">
          Lead: ${data.name} &rarr; ${data.destination}
        </h2>
        <p style="font-size: 12px; color: #64748b; margin: 0 0 16px 0;">
          Status: <strong>New (Requires Assignment & Contact)</strong>
        </p>

        <table>
          <tr>
            <td class="h">Customer Name:</td>
            <td class="v">${data.name}</td>
          </tr>
          <tr>
            <td class="h">Email Address:</td>
            <td class="v"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td class="h">Phone Number:</td>
            <td class="v"><a href="tel:${data.phone}">${data.phone}</a></td>
          </tr>
          <tr>
            <td class="h">Target Destination:</td>
            <td class="v">${data.destination}</td>
          </tr>
          <tr>
            <td class="h">Proposed Travel Date:</td>
            <td class="v">${travelDateFormatted}</td>
          </tr>
          <tr>
            <td class="h">Traveller Count:</td>
            <td class="v">${data.travelersCount} Adults</td>
          </tr>
          ${data.budgetRange ? `
          <tr>
            <td class="h">Budget Range:</td>
            <td class="v">${data.budgetRange}</td>
          </tr>` : ""}
          ${data.travelType ? `
          <tr>
            <td class="h">Holiday Type:</td>
            <td class="v">${data.travelType}</td>
          </tr>` : ""}
          ${data.preferredCallbackTime ? `
          <tr>
            <td class="h">Preferred Call Time:</td>
            <td class="v" style="color: #b91c1c;">${data.preferredCallbackTime}</td>
          </tr>` : ""}
        </table>

        <div class="msg">
          <strong>Customer Notes & Specifications:</strong><br>
          ${data.message}
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <p style="font-size: 12px; color: #64748b;">
            Manage and transition this lead at:
            <a href="${siteConfig.url}/admin/enquiries" style="color: #0f172a; font-weight: bold;">
              ${siteConfig.url}/admin/enquiries
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: businessEmail,
    subject: `[${isCallbackNotice ? "CALLBACK REQUEST" : "NEW ENQUIRY"}] ${data.referenceNo} - ${data.name} (${data.destination})`,
    html,
    replyTo: data.email,
  });
}

export interface BookingEmailData {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  destination: string;
  travelDate: Date | string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  travelersCount: number;
  basePrice: number;
  taxesAmount: number;
  feesAmount: number;
  addonsAmount: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  transactionId?: string | null;
}

/**
 * 3. Customer Booking Confirmation Email
 */
export async function sendCustomerBookingConfirmation(data: BookingEmailData) {
  const travelDateFormatted = new Date(data.travelDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const helplineText = siteConfig.contact.helpline;
  const supportEmail = siteConfig.contact.email;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmed - ${data.bookingReference}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b; }
        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; border: 1px solid #e2e8f0; }
        .header { border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 20px; font-weight: 800; color: #0a192f; letter-spacing: 0.5px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; margin-top: 8px; }
        .ref-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
        .ref-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 1px; }
        .ref-val { font-size: 24px; font-weight: 800; color: #0a192f; font-family: monospace; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; }
        td.label { color: #64748b; font-weight: 600; width: 40%; }
        td.val { color: #0f172a; font-weight: 700; }
        .price-table { background: #f8fafc; border-radius: 10px; overflow: hidden; margin-top: 16px; border: 1px solid #e2e8f0; }
        .total-row { background: #0a192f; color: #ffffff; font-weight: 800; font-size: 15px; }
        .total-row td { color: #ffffff; padding: 12px; }
        .footer { border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="brand">SAH TOUR AND TRAVEL</div>
          <div class="badge">BOOKING CONFIRMED & ALLOTMENT RESERVED</div>
        </div>

        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${data.customerName}</strong>,</p>
        <p style="font-size: 13px; line-height: 1.6; color: #475569;">
          Thank you for choosing Sah Tour And Travel. Your reservation for <strong>${data.packageName}</strong> is officially registered. Your tour voucher and departure kit are accessible via your customer portal.
        </p>

        <div class="ref-box">
          <div class="ref-title">Booking Confirmation ID</div>
          <div class="ref-val">${data.bookingReference}</div>
        </div>

        <h3 style="font-size: 14px; font-weight: 800; color: #0a192f; margin-top: 24px;">Trip & Passenger Manifest</h3>
        <table>
          <tr>
            <td class="label">Package / Destination</td>
            <td class="val">${data.packageName}</td>
          </tr>
          <tr>
            <td class="label">Confirmed Travel Date</td>
            <td class="val">${travelDateFormatted}</td>
          </tr>
          <tr>
            <td class="label">Travellers Count</td>
            <td class="val">${data.adultsCount} Adults${data.childrenCount > 0 ? `, ${data.childrenCount} Children` : ""}${data.infantsCount > 0 ? `, ${data.infantsCount} Infants` : ""} (${data.travelersCount} Total)</td>
          </tr>
          <tr>
            <td class="label">Lead Passenger Contact</td>
            <td class="val">${data.customerPhone} | ${data.customerEmail}</td>
          </tr>
          <tr>
            <td class="label">Reservation Status</td>
            <td class="val" style="color: #047857;">${data.status}</td>
          </tr>
          <tr>
            <td class="label">Payment Status</td>
            <td class="val">${data.paymentStatus} ${data.transactionId ? `(Ref: ${data.transactionId})` : ""}</td>
          </tr>
        </table>

        <h3 style="font-size: 14px; font-weight: 800; color: #0a192f; margin-top: 24px;">Verified Fare Breakdown</h3>
        <table class="price-table">
          <tr>
            <td class="label">Base Fare (All Travellers)</td>
            <td class="val" style="text-align: right;">₹${data.basePrice.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td class="label">Government GST & Taxes (5%)</td>
            <td class="val" style="text-align: right;">₹${data.taxesAmount.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td class="label">Regulatory & Supplier Booking Fee</td>
            <td class="val" style="text-align: right;">₹${data.feesAmount.toLocaleString("en-IN")}</td>
          </tr>
          ${data.addonsAmount > 0 ? `
          <tr>
            <td class="label">Selected Add-ons</td>
            <td class="val" style="text-align: right;">₹${data.addonsAmount.toLocaleString("en-IN")}</td>
          </tr>` : ""}
          <tr class="total-row">
            <td>Total Amount Paid</td>
            <td style="text-align: right; color: #ffffff;">₹${data.totalAmount.toLocaleString("en-IN")} INR</td>
          </tr>
        </table>

        <div class="footer">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #0a192f;">Sah Tour And Travel Operations Desk</p>
          <p style="margin: 0;">Direct Helpline: ${helplineText} | ${supportEmail}</p>
          <p style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
            View or download your digital itinerary voucher at: ${siteConfig.url}/account?tab=bookings
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `Booking Confirmed: ${data.bookingReference} - ${data.packageName} | Sah Tour And Travel`,
    html,
    replyTo: supportEmail,
  });
}

/**
 * 4. Business Booking Notification
 */
export async function sendBusinessBookingNotification(data: BookingEmailData) {
  const businessEmail =
    process.env.BUSINESS_BOOKINGS_EMAIL ||
    process.env.BUSINESS_ENQUIRY_EMAIL ||
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ||
    siteConfig.contact.email ||
    "bookings@sahtourandtravel.com";

  const travelDateFormatted = new Date(data.travelDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking - ${data.bookingReference}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9; padding: 20px; color: #1e293b; }
        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #cbd5e1; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
        td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
        td.h { color: #64748b; font-weight: 600; width: 35%; }
        td.v { color: #0f172a; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2 style="margin: 0; color: #0a192f; font-size: 18px;">[NEW BOOKING RECEIVED] ${data.bookingReference}</h2>
        <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Total Value: ₹${data.totalAmount.toLocaleString("en-IN")} | Status: ${data.status}</p>

        <table>
          <tr>
            <td class="h">Customer Name</td>
            <td class="v">${data.customerName}</td>
          </tr>
          <tr>
            <td class="h">Customer Email</td>
            <td class="v"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td>
          </tr>
          <tr>
            <td class="h">Customer Phone</td>
            <td class="v"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></td>
          </tr>
          <tr>
            <td class="h">Package</td>
            <td class="v">${data.packageName}</td>
          </tr>
          <tr>
            <td class="h">Departure Date</td>
            <td class="v">${travelDateFormatted}</td>
          </tr>
          <tr>
            <td class="h">Pax Breakdown</td>
            <td class="v">${data.adultsCount} Adults, ${data.childrenCount} Children, ${data.infantsCount} Infants (${data.travelersCount} Total)</td>
          </tr>
          <tr>
            <td class="h">Payment Method & TXN</td>
            <td class="v">${data.paymentMethod || "Online"} | Ref: ${data.transactionId || "N/A"}</td>
          </tr>
          <tr>
            <td class="h">Total Collected</td>
            <td class="v" style="color: #047857; font-size: 15px;">₹${data.totalAmount.toLocaleString("en-IN")}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: businessEmail,
    subject: `[BOOKING CONFIRMED] ${data.bookingReference} - ${data.customerName} (₹${data.totalAmount.toLocaleString("en-IN")})`,
    html,
    replyTo: data.customerEmail,
  });
}

