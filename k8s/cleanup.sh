#!/bin/bash

# DevBCN Conference App Kubernetes Cleanup Script

set -e

echo "🧹 Starting cleanup of DevBCN Conference App from Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed."
    exit 1
fi

# Check if namespace exists
if ! kubectl get namespace devbcn-conference &> /dev/null; then
    echo "ℹ️  Namespace 'devbcn-conference' doesn't exist. Nothing to clean up."
    exit 0
fi

echo "📊 Current resources in devbcn-conference namespace:"
kubectl get all -n devbcn-conference

echo ""
read -p "⚠️  This will delete ALL resources in the devbcn-conference namespace. Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo "🗑️  Deleting namespace and all resources..."
kubectl delete namespace devbcn-conference

echo "⏳ Waiting for namespace deletion to complete..."
while kubectl get namespace devbcn-conference &> /dev/null; do
    echo "   Still deleting..."
    sleep 5
done

echo "✅ Cleanup completed! All DevBCN Conference App resources have been removed."