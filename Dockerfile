# Stage 1: Build the Go binary
FROM golang:latest as build

WORKDIR /app

COPY backend/go.mod .
COPY backend/go.sum .
COPY backend/.env .

RUN go mod download

COPY backend/ .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o backend .

EXPOSE 8080

CMD ["./backend"]
