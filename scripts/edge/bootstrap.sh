#!/usr/bin/env bash
set -euo pipefail

# Basic bootstrap script for RK3588 edge node
# 1. Install container runtime
# 2. Join K3s cluster or run standalone docker compose profile

EDGE_ID=${EDGE_ID:-edge-001}
K3S_URL=${K3S_URL:-https://control-plane.example.com:6443}
K3S_TOKEN=${K3S_TOKEN:-changeme}
PROFILE=${PROFILE:-compose}

log() {
  echo "[edge-bootstrap] $*"
}

ensure_root() {
  if [[ $EUID -ne 0 ]]; then
    log "Please run as root"
    exit 1
  fi
}

install_dependencies() {
  log "Updating apt cache"
  apt-get update -y
  apt-get install -y curl ca-certificates gnupg lsb-release
}

install_containerd() {
  if command -v containerd >/dev/null; then
    log "containerd already installed"
    return
  fi
  log "Installing containerd"
  apt-get install -y containerd
  systemctl enable --now containerd
}

install_k3s() {
  curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true sh -s - --node-name "$EDGE_ID" --token "$K3S_TOKEN" --server "$K3S_URL"
  systemctl enable k3s-agent
  systemctl start k3s-agent
}

pull_images() {
  log "Pulling required images"
  images=(
    jodogne/orthanc-plugins:1.12.1
    projectmonai/monai-deploy-app-sdk:latest
    espnet/espnet:cuda11.7-cudnn8-runtime
  )
  for img in "${images[@]}"; do
    nerdctl --namespace k8s.io pull "$img" || docker pull "$img"
  done
}

run_compose_profile() {
  log "Running docker compose edge profile"
  pushd /home/langchao6/projects/bozhi/WiseMed-SmartLink/infra/docker >/dev/null
  docker compose --profile edge up -d
  popd >/dev/null
}

main() {
  ensure_root
  install_dependencies
  install_containerd
  if [[ "$PROFILE" == "k3s" ]]; then
    install_k3s
  else
    log "Skipping k3s install in compose profile"
  fi
  pull_images
  if [[ "$PROFILE" == "compose" ]]; then
    run_compose_profile
  fi
  log "Bootstrap complete for $EDGE_ID"
}

main "$@"
