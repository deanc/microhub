FROM node:14-alpine as builder

RUN apk update && apk add --no-cache redis

COPY package.json package-lock.json ./
RUN npm install --only=prod && mkdir -p /usr/src/app && mv ./node_modules ./usr/src/app

# run compile modules needed
RUN npm install -g tsc

WORKDIR /usr/src/app
COPY . .

# build and run nodejs app
RUN npm run prod
CMD ["node", "dist/index.js"]

# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
# FROM nginx:1.19.5-alpine
# COPY --from=builder /usr/src/app/dist /usr/src/app
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]