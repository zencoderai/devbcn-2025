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

# Function to wait for deployment to be ready
wait_for_deployment() {
    local deployment=$1
    local namespace=$2
    echo "⏳ Waiting for deployment $deployment to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/$deployment -n $namespace
}

# Function to wait for pod to be ready
wait_for_pod() {
    local label=$1
    local namespace=$2
    echo "⏳ Waiting for pod with label $label to be ready..."
    kubectl wait --for=condition=ready --timeout=300s pod -l $label -n $namespace
}

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f k8s-namespace.yaml

# Apply ConfigMap and Secrets
echo "🔧 Applying configuration..."
kubectl apply -f k8s-configmap.yaml

# Deploy PostgreSQL
echo "🐘 Deploying PostgreSQL..."
kubectl apply -f k8s-postgres.yaml
wait_for_deployment postgres devbcn-conference

# Deploy Backend
echo "🔧 Deploying Backend API..."
kubectl apply -f k8s-backend.yaml
wait_for_deployment backend devbcn-conference

# Deploy Frontend
echo "🌐 Deploying Frontend..."
kubectl apply -f k8s-frontend.yaml
wait_for_deployment frontend devbcn-conference

# Deploy Monitoring
echo "📊 Deploying Monitoring stack..."
kubectl apply -f k8s-monitoring.yaml
wait_for_deployment prometheus devbcn-conference
wait_for_deployment grafana devbcn-conference
wait_for_deployment postgres-exporter devbcn-conference

echo "✅ All deployments completed successfully!"

# Display access information
echo ""
echo "🌟 Deployment Summary:"
echo "====================="
echo ""
echo "📱 Application URLs (add these to your /etc/hosts):"
echo "   Frontend: http://devbcn-conference.local"
echo "   Backend API: http://api.devbcn-conference.local"
echo "   Prometheus: http://prometheus.devbcn-conference.local"
echo "   Grafana: http://grafana.devbcn-conference.local (admin/admin)"
echo ""
echo "🔧 To add to /etc/hosts, run:"
echo "   echo '127.0.0.1 devbcn-conference.local api.devbcn-conference.local prometheus.devbcn-conference.local grafana.devbcn-conference.local' | sudo tee -a /etc/hosts"
echo ""
echo "📊 Check deployment status:"
echo "   kubectl get pods -n devbcn-conference"
echo "   kubectl get services -n devbcn-conference"
echo "   kubectl get ingress -n devbcn-conference"
echo ""
echo "🔍 View logs:"
echo "   kubectl logs -f deployment/backend -n devbcn-conference"
echo "   kubectl logs -f deployment/frontend -n devbcn-conference"
echo ""
echo "🗑️  To cleanup:"
echo "   kubectl delete namespace devbcn-conference"