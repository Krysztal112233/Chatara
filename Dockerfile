FROM docker.io/library/rust:slim-trixie AS backend-builder
WORKDIR /builder
RUN apt update && apt install build-essential curl wget file libssl-dev pkg-config -y
COPY ./backend/ .
RUN cargo build --all -r

FROM docker.io/library/debian:trixie-slim AS backend
WORKDIR /app
COPY --from=backend-builder /builder/target/release/charata /app/
CMD [ "./charata" ]

