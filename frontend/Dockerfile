# --- Build stage ---
FROM node:20-alpine AS build
# base image to build the app; alpine = smaller image size, named "build" so the next stage can copy from it

WORKDIR /app
# sets /app as the working directory inside the container for all commands below

COPY package.json package-lock.json ./
# copy only the dependency files first (before the rest of the source) so Docker can cache this layer
# and skip "npm ci" on rebuilds where only the source code changed, not the dependencies

RUN npm ci
# install exact dependency versions from package-lock.json (faster and more reliable than "npm install" for builds)

COPY . .
# copy the rest of the project source code into /app

RUN npm run build
# runs "vite build", producing the static production bundle in /app/dist

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve
# fresh, lightweight image just for serving static files — final image won't contain node/npm or source code

COPY --from=build /app/dist /usr/share/nginx/html
# copy only the built static files from the "build" stage into nginx's default web root

COPY nginx.conf /etc/nginx/conf.d/default.conf
# replace nginx's default config with ours (handles SPA routing so refreshing a route doesn't 404)

EXPOSE 80
# documents that the container listens on port 80 (doesn't actually publish it — that's done with "docker run -p")

CMD ["nginx", "-g", "daemon off;"]
# starts nginx in the foreground (daemon off) so the container keeps running instead of exiting immediately
