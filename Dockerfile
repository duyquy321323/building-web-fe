# Sử dụng hình ảnh Node.js chính thức làm hình ảnh cơ sở
FROM node:18 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép mã nguồn ứng dụng vào thư mục làm việc
COPY . .

# Tạo bản build của ứng dụng
RUN npm run build

# Sử dụng hình ảnh Nginx chính thức để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép bản build từ giai đoạn trước vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 cho Nginx
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
