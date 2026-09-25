FROM node:20-alpine
# lightweight base image with Node 20 preinstalled

WORKDIR /app
# sets /app as the working directory inside the container for all commands below

COPY package.json ./
# copy only the dependency file first so Docker caches this layer and skips "npm install" on rebuilds
# where only server.js/other source changed, not package.json

RUN npm install --omit=dev
# installs dependencies, skipping devDependencies since this image only runs the app, not tests/builds

COPY . .
# copy the rest of the backend source code (server.js, models/, etc.) into /app

EXPOSE 5000
# documents that the container listens on port 5000 (doesn't publish it — no host port mapping in compose,
# since only the frontend needs to reach it, over the internal Docker network)

CMD ["node", "server.js"]
# starts the Express server; keeps the container running in the foreground
