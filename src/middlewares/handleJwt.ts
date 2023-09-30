import bcryptjs from 'bcryptjs';

async function encrypt(passwordPlain: string): Promise<string> {
  const hash = await bcryptjs.hash(passwordPlain, 10);
  return hash;
}

async function compare(
  passwordPlain: string,
  hashPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(passwordPlain, hashPassword);
}

export { encrypt, compare };
