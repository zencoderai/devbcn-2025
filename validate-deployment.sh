#!/bin/bash

# DevBCN Conference App Deployment Validation Script

set -e

NAMESPACE="devbcn-conference"

echo "🔍 Validating DevBCN Conference App deployment..."

# Function to check if deployment is ready
check_deployment() {
    local deployment=$1
    local replicas=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
    local desired=$(kubectl get deployment $deployment -n $NAMESPACE -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "0")
    
    if [ "$replicas" = "$desired" ] && [ "$replicas" != "0" ]; then
        echo "✅ $deployment: $replicas/$desired replicas ready"
        return 0
    else
        echo "❌ $deployment: $replicas/$desired replicas ready"
        return 1
    fi
}

# Function to check if service has endpoints
check_service() {
    local service=$1
    local endpoints=$(kubectl get endpoints $service -n $NAMESPACE -o jsonpath='{.subsets[0].addresses}' 2>/dev/null || echo "")
    
    if [ -n "$endpoints" ]; then
        echo "✅ $service: Service has endpoints"
        return 0
    else
        echo "❌ $service: Service has no endpoints"
        return 1
    fi
}

# Function to check if ingress is configured
check_ingress() {
    local ingress=$1
    local hosts=$(kubectl get ingress $ingress -n $NAMESPACE -o jsonpath='{.spec.rules[*].host}' 2>/dev/null || echo "")
    
    if [ -n "$hosts" ]; then
        echo "✅ $ingress: Configured for hosts: $hosts"
        return 0
    else
        echo "❌ $ingress: No hosts configured"
        return 1
    fi
}

# Function to check if PVC is bound
check_pvc() {
    local pvc=$1
    local status=$(kubectl get pvc $pvc -n $NAMESPACE -o jsonpath='{.status.phase}' 2>/dev/null || echo "")
    
    if [ "$status" = "Bound" ]; then
        echo "✅ $pvc: PVC is bound"
        return 0
    else
        echo "❌ $pvc: PVC status is $status"
        return 1
    fi
}

echo ""
echo "📦 Checking namespace..."
if kubectl get namespace $NAMESPACE &>/dev/null; then
    echo "✅ Namespace $NAMESPACE exists"
else
    echo "❌ Namespace $NAMESPACE does not exist"
    exit 1
fi

echo ""
echo "💾 Checking Persistent Volume Claims..."
check_pvc "postgres-pvc"
check_pvc "prometheus-pvc"
check_pvc "grafana-pvc"

echo ""
echo "🚀 Checking Deployments..."
check_deployment "postgres"
check_deployment "backend"
check_deployment "frontend"
check_deployment "prometheus"
check_deployment "grafana"
check_deployment "postgres-exporter"

echo ""
echo "🌐 Checking Services..."
check_service "postgres-service"
check_service "backend-service"
check_service "frontend-service"
check_service "prometheus-service"
check_service "grafana-service"
check_service "postgres-exporter-service"

echo ""
echo "🔗 Checking Ingresses..."
check_ingress "backend-ingress"
check_ingress "frontend-ingress"
check_ingress "monitoring-ingress"

echo ""
echo "🔧 Checking ConfigMaps and Secrets..."
if kubectl get configmap app-config -n $NAMESPACE &>/dev/null; then
    echo "✅ ConfigMap app-config exists"
else
    echo "❌ ConfigMap app-config does not exist"
fi

if kubectl get secret app-secrets -n $NAMESPACE &>/dev/null; then
    echo "✅ Secret app-secrets exists"
else
    echo "❌ Secret app-secrets does not exist"
fi

if kubectl get configmap prometheus-config -n $NAMESPACE &>/dev/null; then
    echo "✅ ConfigMap prometheus-config exists"
else
    echo "❌ ConfigMap prometheus-config does not exist"
fi

echo ""
echo "🏥 Checking Pod Health..."
kubectl get pods -n $NAMESPACE

echo ""
echo "📊 Resource Usage:"
kubectl top pods -n $NAMESPACE 2>/dev/null || echo "Metrics server not available"

echo ""
echo "🌟 Validation Summary:"
echo "====================="

# Count ready deployments
ready_deployments=0
total_deployments=6

for deployment in postgres backend frontend prometheus grafana postgres-exporter; do
    if check_deployment $deployment &>/dev/null; then
        ((ready_deployments++))
    fi
done

echo "Deployments ready: $ready_deployments/$total_deployments"

if [ $ready_deployments -eq $total_deployments ]; then
    echo "🎉 All deployments are healthy!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend: http://devbcn-conference.local"
    echo "   Backend API: http://api.devbcn-conference.local"
    echo "   Prometheus: http://prometheus.devbcn-conference.local"
    echo "   Grafana: http://grafana.devbcn-conference.local"
    echo ""
    echo "💡 Don't forget to add these to your /etc/hosts:"
    echo "   127.0.0.1 devbcn-conference.local api.devbcn-conference.local prometheus.devbcn-conference.local grafana.devbcn-conference.local"
else
    echo "⚠️  Some deployments are not ready. Check the logs:"
    echo "   kubectl logs -f deployment/[deployment-name] -n $NAMESPACE"
fi