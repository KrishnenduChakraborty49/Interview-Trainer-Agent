# Use Node.js to build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the static frontend files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration to route API requests if needed
# For now, default Nginx config is fine for serving static React router
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
