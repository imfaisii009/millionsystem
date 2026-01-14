interface ContactNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  projectType: string;
  budget: string;
  message: string;
}

export function ContactNotificationEmail({
  firstName,
  lastName,
  email,
  company,
  projectType,
  budget,
  message,
}: ContactNotificationEmailProps) {
  const budgetLabels: Record<string, string> = {
    "5-10k": "$5,000 - $10,000",
    "10-25k": "$10,000 - $25,000",
    "25-50k": "$25,000 - $50,000",
    "50k+": "$50,000+",
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 32px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                      MillionSystems
                    </h1>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 6px 14px; background-color: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 12px; font-weight: 600; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      New Lead
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 16px 40px; border-bottom: 1px solid #fbbf24;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="24" valign="top">
                    <span style="font-size: 18px;">&#128276;</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                      New contact form submission received!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px; color: #1f2937; font-size: 22px; font-weight: 600;">
                Contact Details
              </h2>

              <!-- Contact Info Grid -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding: 0 8px 16px 0; vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Full Name
                    </p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">
                      ${firstName} ${lastName}
                    </p>
                  </td>
                  <td width="50%" style="padding: 0 0 16px 8px; vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Email
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #7c3aed; font-size: 16px; font-weight: 500; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 0 8px 16px 0; vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Company
                    </p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">
                      ${company || "Not specified"}
                    </p>
                  </td>
                  <td width="50%" style="padding: 0 0 16px 8px; vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Budget Range
                    </p>
                    <p style="margin: 0; color: #059669; font-size: 16px; font-weight: 600;">
                      ${budgetLabels[budget] || budget}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Project Type Badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Project Type
                    </p>
                    <span style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%); color: #7c3aed; font-size: 14px; font-weight: 600; border-radius: 8px; border: 1px solid #e0e7ff;">
                      ${projectType}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Message Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Message
                    </p>
                    <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${message}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your ${projectType} Inquiry - MillionSystems&body=Hi ${firstName},%0D%0A%0D%0AThank you for reaching out to us about your ${projectType} project.%0D%0A%0D%0A" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
                      Reply to ${firstName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center;">
                This email was sent from the MillionSystems contact form.<br>
                <span style="color: #9ca3af;">Received at ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
