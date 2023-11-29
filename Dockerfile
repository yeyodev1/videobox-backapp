# Utiliza la imagen base de Node.js
FROM node:18-bullseye

# Instala ffmpeg, necesario para tu aplicación
RUN apt-get update && apt-get install -y ffmpeg

# Define el directorio de trabajo
WORKDIR /src

# Copia los archivos package.json y package-lock.json (o solo package.json si no usas package-lock.json)
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Crea un directorio temporal, si es necesario para tu aplicación
RUN mkdir tmp

# Aceptar variables de entorno como argumentos de compilación
ARG PORT
ARG MONGODB_URI
ARG NODE_ENV
ARG TYPE
ARG PROJECT_ID
ARG PRIVATE_ID_KEY
ARG PRIVATE_KEY
ARG CLIENT_EMAIL
ARG CLIENT_ID
ARG AUTH_URI
ARG TOKEN_URI
ARG AUTH_PROVIDER_X59_CERT_URL
ARG CLIENT_X59_CERT_URL
ARG UNIVERSE_DOMAIN
ARG JWT_SECRET
ARG BUCKET_PROJECT_ID
ARG BUCKET_CLIENT_EMAIL
ARG BUCKET_PRIVATE_KEY
ARG DRIVE_API_KEY

# Establecer las variables de entorno
ENV PORT=${PORT} \
  MONGODB_URI=${MONGODB_URI} \
  NODE_ENV=${NODE_ENV} \
  TYPE=${TYPE} \
  PROJECT_ID=${PROJECT_ID} \
  PRIVATE_ID_KEY=${PRIVATE_ID_KEY} \
  PRIVATE_KEY=${PRIVATE_KEY} \
  CLIENT_EMAIL=${CLIENT_EMAIL} \
  CLIENT_ID=${CLIENT_ID} \
  AUTH_URI=${AUTH_URI} \
  TOKEN_URI=${TOKEN_URI} \
  AUTH_PROVIDER_X59_CERT_URL=${AUTH_PROVIDER_X59_CERT_URL} \
  CLIENT_X59_CERT_URL=${CLIENT_X59_CERT_URL} \
  UNIVERSE_DOMAIN=${UNIVERSE_DOMAIN} \
  JWT_SECRET=${JWT_SECRET} \
  BUCKET_PROJECT_ID=${BUCKET_PROJECT_ID} \
  BUCKET_CLIENT_EMAIL=${BUCKET_CLIENT_EMAIL} \
  BUCKET_PRIVATE_KEY=${BUCKET_PRIVATE_KEY} \
  DRIVE_API_KEY=${DRIVE_API_KEY}

# Compilar el código TypeScript (si es necesario)
RUN npm run compile

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 8080

# Definir el comando para ejecutar la aplicación
CMD [ "node", "dist/index.js" ]
