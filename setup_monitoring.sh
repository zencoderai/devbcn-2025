#!/bin/bash

echo "🚀 Setting up Conference API Monitoring..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker compose is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

echo "📦 Building and starting services..."
docker compose up -d --build

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."

services=("backend" "prometheus" "grafana" "postgres-exporter")
for service in "${services[@]}"; do
    if docker compose ps | grep -q "$service.*Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
    fi
done

echo ""
echo "🎯 Monitoring Setup Complete!"
echo ""
echo "📊 Access your monitoring tools:"
echo "   • Conference API: http://localhost:8000"
echo "   • API Metrics: http://localhost:8000/metrics"
echo "   • API Health: http://localhost:8000/health"
echo "   • Prometheus: http://localhost:9090"
echo "   • Grafana: http://localhost:3001 (admin/admin)"
echo "   • PostgreSQL Exporter: http://localhost:9187"
echo ""
echo "📈 The Conference API Dashboard should be automatically available in Grafana."
echo ""
echo "🧪 To test the monitoring setup:"
echo "   python3 monitoring/test_monitoring.py"
echo ""
echo "🛑 To stop all services:"
echo "   docker compose down"
echo ""