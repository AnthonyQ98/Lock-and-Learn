FROM golang:latest as build

WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=1 GOOS=linux go build -o backend .

FROM alpine:latest

WORKDIR /app
COPY --from=build /app/backend .
COPY backend/.env .
EXPOSE 8080

CMD ["./backend"]
