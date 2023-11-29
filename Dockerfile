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

# Compilar el código TypeScript (si es necesario)
RUN npm run build

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 8080

# Definir el comando para ejecutar la aplicación
CMD [ "node", "dist/index.js" ]
