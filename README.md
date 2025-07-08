# DevBCN 2025 Conference Website

A full-stack conference website built with React (frontend), FastAPI (backend), and PostgreSQL (database).

## Features

- **Home Page**: Conference information and overview
- **Submit Talk**: Form for speakers to submit their talk proposals
- **Talks Page**: Browse and filter submitted talks
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **REST API**: FastAPI backend with PostgreSQL database

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls

### Backend
- FastAPI
- SQLAlchemy (ORM)
- PostgreSQL
- Pydantic for data validation

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database

### Monitoring
- Prometheus for metrics collection
- Grafana for visualization and dashboards
- PostgreSQL Exporter for database metrics

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devbcn-2025
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Monitoring Setup

To set up monitoring with Prometheus and Grafana:

1. **Quick setup with script**
   ```bash
   ./setup_monitoring.sh
   ```

2. **Manual setup**
   ```bash
   docker compose up -d --build
   ```

3. **Access monitoring tools**
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (admin/admin)
   - API Metrics: http://localhost:8000/metrics
   - PostgreSQL Metrics: http://localhost:9187

The Conference API Dashboard will be automatically provisioned in Grafana with metrics for:
- Request rates and response times
- HTTP status code distribution
- Service health status
- Database connections and transactions

For more details, see [monitoring/README.md](monitoring/README.md).

The application will automatically:
- Set up the PostgreSQL database
- Create the necessary tables
- Start the FastAPI backend
- Start the React frontend

## Development

### Backend Development

The backend is built with FastAPI and includes:

- **Models**: SQLAlchemy models for database tables
- **Schemas**: Pydantic models for request/response validation
- **CRUD**: Database operations
- **API Endpoints**:
  - `GET /conference-info` - Get conference information
  - `POST /talks/` - Submit a new talk
  - `GET /talks/` - Get all talks
  - `GET /talks/{id}` - Get a specific talk

### Frontend Development

The frontend is a React application with:

- **Pages**:
  - Home: Conference overview and information
  - Submit Talk: Form for talk submissions
  - Talks: Browse and filter submitted talks
- **Components**: Reusable UI components
- **Services**: API integration with Axios
- **Styling**: Tailwind CSS for responsive design

### Database Schema

The application uses a single `talks` table with the following fields:

- `id`: Primary key
- `title`: Talk title
- `description`: Talk description
- `speaker_name`: Speaker's name
- `speaker_email`: Speaker's email
- `speaker_bio`: Speaker's biography
- `speaker_company`: Speaker's company
- `talk_type`: Type of talk (keynote, talk, workshop, lightning)
- `duration`: Duration in minutes
- `level`: Difficulty level (beginner, intermediate, advanced)
- `tags`: Comma-separated tags
- `is_approved`: Approval status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## Docker Services

The application consists of the following Docker services:

1. **frontend**: React development server
2. **backend**: FastAPI application with hot reload
3. **db**: PostgreSQL database
4. **prometheus**: Metrics collection and storage
5. **grafana**: Visualization and dashboards
6. **postgres-exporter**: PostgreSQL metrics exporter

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.