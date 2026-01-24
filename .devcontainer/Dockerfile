FROM node:22-bookworm-slim AS node

FROM mcr.microsoft.com/devcontainers/rust:2-1-trixie

COPY --from=node /usr/local/ /usr/local/

RUN apt-get update && apt-get install -y ffmpeg mingw-w64 mpv

RUN rustup target add x86_64-pc-windows-gnu x86_64-unknown-linux-gnu aarch64-apple-darwin x86_64-apple-darwin
