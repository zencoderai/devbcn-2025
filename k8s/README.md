# DevBCN Conference App - Kubernetes Deployment

This directory contains Kubernetes manifests to deploy the DevBCN Conference application to a Kubernetes cluster.

## Architecture

The application consists of the following components:

- **Frontend**: React application (2 replicas)
- **Backend**: FastAPI application (2 replicas)
- **Database**: PostgreSQL (1 replica with persistent storage)
- **Monitoring**: Prometheus, Grafana, and PostgreSQL Exporter
- **Ingress**: NGINX Ingress Controller for external access

## Prerequisites

1. **Kubernetes Cluster**: A running Kubernetes cluster (local or cloud)
2. **kubectl**: Configured to connect to your cluster
3. **NGINX Ingress Controller**: Installed in your cluster
4. **Container Registry**: Access to push Docker images

### Installing NGINX Ingress Controller

If you don't have NGINX Ingress Controller installed:

```bash
# For local development (minikube, kind, etc.)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# For cloud providers, check the official documentation:
# https://kubernetes.github.io/ingress-nginx/deploy/
```

## Deployment Steps

### 1. Build and Push Docker Images

First, build and push your Docker images to a container registry:

```bash
# Build images
docker build -t your-registry/devbcn-backend:latest ./backend
docker build -t your-registry/devbcn-frontend:latest ./frontend

# Push to registry
docker push your-registry/devbcn-backend:latest
docker push your-registry/devbcn-frontend:latest
```

### 2. Update Image References

Update the image names in the deployment files:

- `k8s/backend.yaml`: Update `image: devbcn-backend:latest` to your registry
- `k8s/frontend.yaml`: Update `image: devbcn-frontend:latest` to your registry

### 3. Deploy to Kubernetes

Run the deployment script:

```bash
./k8s/deploy.sh
```

Or deploy manually:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml

# Deploy database
kubectl apply -f k8s/postgres.yaml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n devbcn-conference --timeout=300s

# Deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Deploy monitoring
kubectl apply -f k8s/prometheus.yaml
kubectl apply -f k8s/postgres-exporter.yaml
kubectl apply -f k8s/grafana.yaml

# Create ingress
kubectl apply -f k8s/ingress.yaml
```

### 4. Configure DNS

Add the following to your `/etc/hosts` file for local access:

```
127.0.0.1 devbcn-conference.local
```

Or configure your DNS to point to your ingress controller's external IP.

## Accessing the Application

Once deployed, you can access:

- **Frontend**: http://devbcn-conference.local
- **Backend API**: http://devbcn-conference.local/api
- **Grafana**: http://devbcn-conference.local/grafana (admin/admin)
- **Prometheus**: http://devbcn-conference.local/prometheus

## Monitoring and Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n devbcn-conference
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n devbcn-conference

# Frontend logs
kubectl logs -f deployment/frontend -n devbcn-conference

# Database logs
kubectl logs -f deployment/postgres -n devbcn-conference
```

### Check Services

```bash
kubectl get services -n devbcn-conference
```

### Check Ingress

```bash
kubectl get ingress -n devbcn-conference
kubectl describe ingress devbcn-ingress -n devbcn-conference
```

## Scaling

Scale the application components:

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n devbcn-conference

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n devbcn-conference
```

## Configuration

### Environment Variables

Configuration is managed through ConfigMaps and Secrets:

- `app-config`: Non-sensitive configuration
- `app-secrets`: Sensitive data (passwords, tokens)

### Persistent Storage

The following components use persistent storage:

- PostgreSQL: 10Gi
- Prometheus: 10Gi
- Grafana: 5Gi

## Security Considerations

1. **Secrets**: Database passwords are stored in Kubernetes Secrets
2. **Network Policies**: Consider implementing network policies for production
3. **RBAC**: Configure appropriate RBAC rules
4. **Image Security**: Scan images for vulnerabilities before deployment
5. **TLS**: Configure TLS certificates for production use

## Production Considerations

For production deployment, consider:

1. **Resource Limits**: Adjust CPU and memory limits based on your needs
2. **High Availability**: Deploy across multiple nodes/zones
3. **Backup Strategy**: Implement database backup procedures
4. **Monitoring**: Set up alerts and monitoring dashboards
5. **Security**: Implement proper security policies and network segmentation
6. **CI/CD**: Integrate with your CI/CD pipeline
7. **TLS/SSL**: Configure proper certificates and encryption

## Cleanup

To remove the entire deployment:

```bash
kubectl delete namespace devbcn-conference
```

## File Structure

```
k8s/
├── README.md                 # This file
├── deploy.sh                 # Deployment script
├── namespace.yaml            # Namespace definition
├── configmap.yaml            # Configuration and secrets
├── postgres.yaml             # PostgreSQL database
├── backend.yaml              # FastAPI backend
├── frontend.yaml             # React frontend
├── prometheus.yaml           # Prometheus monitoring
├── grafana.yaml              # Grafana dashboards
├── postgres-exporter.yaml    # PostgreSQL metrics exporter
└── ingress.yaml              # Ingress configuration
```