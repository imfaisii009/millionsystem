import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { ContactConfirmationEmail } from "@/emails/contact-confirmation";
import { ContactNotificationEmail } from "@/emails/contact-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const TEAM_EMAILS = ["imfaisii009@gmail.com", "haamzaaay@gmail.com", "ruigostadefrango@gmail.com"];
const FROM_EMAIL = "MillionSystems <info@millionsystems.com>";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Prepare confirmation email for user
    const userConfirmationEmail = {
      from: FROM_EMAIL,
      to: data.email,
      subject: `Thank You for Contacting MillionSystems - ${data.projectType}`,
      html: ContactConfirmationEmail({
        firstName: data.firstName,
        lastName: data.lastName,
        projectType: data.projectType,
      }),
    };

    // Prepare notification emails for team members
    const teamNotificationEmails = TEAM_EMAILS.map((teamEmail) => ({
      from: FROM_EMAIL,
      to: teamEmail,
      subject: `New Contact Form: ${data.firstName} ${data.lastName} - ${data.projectType}`,
      html: ContactNotificationEmail({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        projectType: data.projectType,
        budget: data.budget,
        message: data.message,
      }),
    }));

    // Send all emails using batch API
    const { data: batchData, error } = await resend.batch.send([
      userConfirmationEmail,
      ...teamNotificationEmails,
    ]);

    if (error) {
      console.error("Resend batch error:", error);
      return NextResponse.json(
        { error: "Failed to send emails", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      emailIds: batchData?.data?.map((d) => d.id),
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
