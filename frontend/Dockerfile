FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps \
    && npm install ajv@8 --no-save --legacy-peer-deps

COPY . .

ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND=${REACT_APP_BACKEND}

RUN echo "Building frontend with backend: $REACT_APP_BACKEND" \
    && CI=false NODE_OPTIONS=--max-old-space-size=384 npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]