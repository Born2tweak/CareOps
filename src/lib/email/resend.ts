import { Resend } from "resend";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set.");
  }
  return new Resend(apiKey);
}

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: SendEmailParams): Promise<{ id: string }> {
  const resend = getResendClient();
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? "CareOps <noreply@careops.app>";

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return { id: data?.id ?? "unknown" };
}
