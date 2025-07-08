#!/bin/bash

# DevBCN Conference App Kubernetes Deployment Script

set -e

echo "🚀 Starting DevBCN Conference App deployment to Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Not connected to a Kubernetes cluster. Please configure kubectl."
    exit 1
fi

echo "✅ Connected to Kubernetes cluster"

# Build Docker images (you'll need to push these to a registry)
echo "📦 Building Docker images..."
echo "Note: You'll need to build and push these images to your container registry:"
echo "  docker build -t your-registry/devbcn-backend:latest ./backend"
echo "  docker build -t your-registry/devbcn-frontend:latest ./frontend"
echo "  docker push your-registry/devbcn-backend:latest"
echo "  docker push your-registry/devbcn-frontend:latest"
echo ""
echo "Then update the image names in k8s/backend.yaml and k8s/frontend.yaml"
echo ""

read -p "Have you built and pushed the Docker images? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please build and push the Docker images first, then run this script again."
    exit 1
fi

# Apply Kubernetes manifests in order
echo "🔧 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

echo "🔧 Creating ConfigMap and Secrets..."
kubectl apply -f k8s/configmap.yaml

echo "🔧 Deploying PostgreSQL..."
kubectl apply -f k8s/postgres.yaml

echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n devbcn-conference --timeout=300s

echo "🔧 Deploying Backend..."
kubectl apply -f k8s/backend.yaml

echo "⏳ Waiting for Backend to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n devbcn-conference --timeout=300s

echo "🔧 Deploying Frontend..."
kubectl apply -f k8s/frontend.yaml

echo "🔧 Deploying Monitoring stack..."
kubectl apply -f k8s/prometheus.yaml
kubectl apply -f k8s/postgres-exporter.yaml
kubectl apply -f k8s/grafana.yaml

echo "🔧 Creating Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "✅ Deployment completed!"
echo ""
echo "📊 Checking deployment status..."
kubectl get pods -n devbcn-conference
echo ""
kubectl get services -n devbcn-conference
echo ""

echo "🌐 Access your application:"
echo "  Frontend: http://devbcn-conference.local"
echo "  Backend API: http://devbcn-conference.local/api"
echo "  Grafana: http://devbcn-conference.local/grafana"
echo "  Prometheus: http://devbcn-conference.local/prometheus"
echo ""
echo "Note: Add '127.0.0.1 devbcn-conference.local' to your /etc/hosts file"
echo "      or configure your DNS to point to your ingress controller."