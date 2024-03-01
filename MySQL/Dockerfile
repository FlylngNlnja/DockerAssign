FROM mysql:latest

ENV MYSQL_DATABASE=video_streaming
ENV MYSQL_USER=mainuser
ENV MYSQL_PASSWORD=mainpassword
RUN echo "ALTER USER 'mainuser'@'%' IDENTIFIED WITH mysql_native_password BY 'mainpassword';" >> /docker-entrypoint-initdb.d/schema.sql
COPY . .
COPY basicschema.sql /docker-entrypoint-initdb.d/
EXPOSE 3306