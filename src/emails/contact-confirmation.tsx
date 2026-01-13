interface ContactConfirmationEmailProps {
  firstName: string;
  lastName: string;
  projectType: string;
}

export function ContactConfirmationEmail({
  firstName,
  lastName,
  projectType,
}: ContactConfirmationEmailProps) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We've Received Your Proposal</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                MillionSystem
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Transforming Ideas Into Reality
              </p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: inline-block; line-height: 80px;">
                <span style="font-size: 40px; color: #ffffff;">&#10003;</span>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">
                Thank You, ${firstName}!
              </h2>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.7; text-align: center;">
                We're excited to let you know that we've successfully received your proposal for <strong style="color: #7c3aed;">${projectType}</strong>.
              </p>

              <!-- Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #7c3aed;">
                    <h3 style="margin: 0 0 12px; color: #7c3aed; font-size: 16px; font-weight: 600;">
                      What Happens Next?
                    </h3>
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      Our team is reviewing your project details carefully. After analyzing your requirements and finding the perfect solution tailored to your needs, we'll reach out to you <strong>within 24 hours</strong>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">

              <!-- Contact Info -->
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; text-align: center;">
                Need to reach us sooner? We're here to help!
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-radius: 12px; margin-bottom: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="middle">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="color: #ffffff; font-size: 16px;">&#9993;</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;" valign="middle">
                          <p style="margin: 0 0 2px; color: #6b7280; font-size: 12px; font-weight: 500;">Email</p>
                          <a href="mailto:info@millionsystems.com" style="color: #7c3aed; font-size: 15px; font-weight: 600; text-decoration: none;">info@millionsystems.com</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-radius: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="40" valign="middle">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; text-align: center; line-height: 36px;">
                            <span style="color: #ffffff; font-size: 16px;">&#9742;</span>
                          </div>
                        </td>
                        <td style="padding-left: 12px;" valign="middle">
                          <p style="margin: 0 0 2px; color: #6b7280; font-size: 12px; font-weight: 500;">Call Us</p>
                          <a href="tel:+447943111370" style="color: #059669; font-size: 15px; font-weight: 600; text-decoration: none;">+44 7943 111370</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #ffffff; font-size: 16px; font-weight: 600;">
                MillionSystem
              </p>
              <p style="margin: 0 0 16px; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                Turner Business Centre, Greengate<br>
                Middleton, Manchester M24 1RU
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                &copy; ${new Date().getFullYear()} MillionSystem. All rights reserved.
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
