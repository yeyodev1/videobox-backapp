import mongoose from 'mongoose';

import { Environment_Variables } from '../enum/EnvironmentVariables';

async function dbConnect(): Promise<void> {
  try {
    let DB_URI = process.env.MONGODB_URI;

    if (process.env.NODE_ENV === Environment_Variables.DEVELOPMENT) {
      DB_URI = process.env.MONGODB_URI_DEVELOPMENT;
    }

    if (process.env.NODE_ENV === Environment_Variables.PRODUCTION) {
      DB_URI = process.env.MONGODB_URI;
    }

    if (!DB_URI) {
      throw new Error('No mongodb URI');
    }

    await mongoose.connect(DB_URI);
    console.log('*** CONEXION CORRECTA ***');
  } catch (error) {
    console.log('*** ERROR DE CONEXION ***', error);
  }
}

export default dbConnect;
