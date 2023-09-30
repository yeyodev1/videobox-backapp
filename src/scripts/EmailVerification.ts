import models from '../models/index';
import { tokenSign } from '../utils/handleJwt';
import { generateEmailVerificationTemplate } from '../emails/EmailVerification';
import { sendEmail } from '../services/sendGrid';

export async function sendVerification(): Promise<void> {
  try {
    const users = await models.users.find();

    for (let i = 0; i < users.length; i++) {
      const email = users[i].email;
      const id = users[i].id;
      const role = users[i].role;

      const token = await tokenSign({
        role: role,
        _id: id
      });

      const link = `https://predix.ec/email-verified/${token}`;
      const verificationBody = generateEmailVerificationTemplate(link);
      sendEmail(email, 'EMAIL DE VERIFICACIÓN', verificationBody);
    }
  } catch (error) {
    console.log(error);
  }
}
