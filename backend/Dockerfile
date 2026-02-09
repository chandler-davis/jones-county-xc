FROM alpine:latest
WORKDIR /app
COPY server .
RUN chmod +x server
EXPOSE 8080
CMD ["./server"]
