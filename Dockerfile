FROM nginx:alpine

# Set the working directory in Nginx
WORKDIR /usr/share/nginx/html

# Copy the pre-built React files from the build directory
COPY dist/ .


COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
