# Musify 🎵

A modern music streaming platform built with Spring Boot, React, and PostgreSQL.

## Introduction

Musify is a full-stack music streaming application that allows users to discover, play, and manage their favorite music. The platform features user authentication, artist and album management, playlist creation, and interactive music playback.

### Key Features

- 🎵 **Music Streaming** - Browse and play songs from various artists and albums
- 👤 **User Authentication** - Secure JWT-based authentication system
- 📝 **Playlist Management** - Create and manage personal playlists
- ❤️ **Favorites** - Like songs and follow artists
- 🎨 **Artist & Album Management** - Admin panel for content management
- 🔍 **Search** - Find songs, artists, and albums
- 📊 **Listening History** - Track your music listening activity

### Tech Stack

**Backend:**
- Spring Boot 3.5.6
- Java 21
- PostgreSQL 16
- Spring Security with JWT
- Maven

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- TailwindCSS

**Infrastructure:**
- Docker & Docker Compose
- Nginx (for production frontend)

---

## Installation Guide

### Prerequisites

- Docker Desktop installed
- Git

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Musify
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5433
   - Backend API on port 8080
   - Frontend web app on port 3000

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5433

4. **Stop services**
   ```bash
   docker compose down
   ```

5. **Stop and remove volumes (clean slate)**
   ```bash
   docker compose down -v
   ```

### Development Setup

#### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   ./mvnw clean install
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at http://localhost:5173

---

## Folder Structure

```
Musify/
├── backend/                      # Spring Boot backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/musify/backend/
│   │   │   │   ├── controller/   # REST API controllers
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── entity/       # JPA entities
│   │   │   │   ├── filter/       # Security filters (JWT)
│   │   │   │   ├── repository/   # JPA repositories
│   │   │   │   ├── security/     # Security configuration
│   │   │   │   ├── service/      # Business logic layer
│   │   │   │   │   └── impl/     # Service implementations
│   │   │   │   └── util/         # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.properties  # App configuration
│   │   │       ├── sql/          # Database initialization scripts
│   │   │       └── static/       # Static files (images, audio)
│   │   └── test/                 # Unit and integration tests
│   ├── Dockerfile                # Backend Docker configuration
│   ├── pom.xml                   # Maven dependencies
│   └── mvnw                      # Maven wrapper
│
├── frontend/                     # React frontend application
│   ├── public/                   # Public assets
│   ├── src/
│   │   ├── assets/               # Images, icons, fonts
│   │   ├── components/           # Reusable React components
│   │   │   └── admin/            # Admin panel components
│   │   ├── contexts/             # React Context providers
│   │   ├── helpers/              # Helper functions and API client
│   │   └── pages/                # Page components
│   ├── Dockerfile                # Frontend Docker configuration
│   ├── package.json              # NPM dependencies
│   └── vite.config.js            # Vite configuration
│
├── docker-compose.yml            # Docker orchestration
└── README.md                     # This file
```

### Backend Structure Details

- **controller/** - REST endpoints for artists, albums, tracks, users, playlists
- **dto/** - Request/response objects for API communication
- **entity/** - Database models (User, Artist, Album, Track, Playlist, etc.)
- **filter/** - JWT token validation filter
- **repository/** - Database access layer using Spring Data JPA
- **security/** - Authentication and authorization configuration
- **service/** - Business logic for all features

### Frontend Structure Details

- **components/** - Reusable UI components (Header, Sidebar, Player, etc.)
- **contexts/** - Global state management (Auth, Player, Playlists)
- **helpers/** - API client with axios, URL helpers
- **pages/** - Route components (Home, Login, Artist, Album, Playlist, Admin)

---

## Environment Variables

### Backend

Configure in `backend/src/main/resources/application.properties` or via Docker:

- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password

### Frontend

Configure in `frontend/.env`:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8080)

---

## Default Credentials

After initial setup, you can access the admin panel with default credentials (if seeded in data.sql).

---

## Docker Commands

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Rebuild specific service
docker compose up -d --build backend
docker compose up -d --build frontend

# Stop all services
docker compose down

# Remove all data (databases, volumes)
docker compose down -v
```

---