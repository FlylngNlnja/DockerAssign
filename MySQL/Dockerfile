FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=video_streaming
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=atyponwebdev
COPY basicschema.sql /docker-entrypoint-basicschemadb.d/
EXPOSE 3306