import sendgrid from '@sendgrid/mail';

import type { EmailMessage } from '../types/EmailType';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(
  email: string,
  subject: string,
  body: string
): Promise<void> {
  const messageData: EmailMessage = {
    to: email,
    from: 'lreyes@nabux.ec',
    subject: subject,
    html: body
  };

  try {
    await sendgrid.send(messageData);
  } catch (error) {
    console.log(error);
  }
}
