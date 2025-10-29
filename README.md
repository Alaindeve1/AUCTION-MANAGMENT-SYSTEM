# 🏆 Auction Management System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status: Active">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version: 1.0.0">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT">
  <br>
  <img src="Auction Management System ERD.png" alt="Auction System ERD" width="600">
</div>

## 🌟 Overview

A modern, full-stack Auction Management System that provides a seamless platform for users to participate in auctions, list items, and manage bids in real-time. Built with a React.js frontend and Spring Boot backend, this application offers a robust and scalable solution for online auctions.

## ✨ Features

### 🏷️ User Features
- **User Authentication** - Secure registration and login system
- **Auction Listings** - Browse and search active auctions with filters
- **Real-time Bidding** - Place and track bids with live updates
- **Watchlist** - Save interesting items for later
- **Bid History** - Track your bidding activity
- **User Dashboard** - Manage your profile and activities

### 🛠️ Admin Features
- **User Management** - View and manage system users
- **Auction Moderation** - Approve, edit, or remove auctions
- **Category Management** - Manage product categories
- **System Monitoring** - View system statistics and activity logs
- **Report Generation** - Generate sales and user activity reports

### 🚀 Technical Highlights
- **Real-time Updates** - WebSocket integration for live bid updates
- **Responsive Design** - Mobile-friendly interface
- **Secure Authentication** - JWT-based authentication
- **File Upload** - Support for item images
- **Email Notifications** - Stay updated on auction activity

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: Context API
- **Styling**: CSS Modules / Styled Components
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation
- **UI Components**: Custom components with Material-UI

### Backend
- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven
- **Containerization**: Docker

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Environment Management**: Dotenv

## 🚀 Getting Started

### Prerequisites
- Java JDK 17+
- Node.js 16+
- PostgreSQL 13+
- Maven 3.8+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/auction-system.git
   cd auction-system
   ```

2. **Backend Setup**
   ```bash
   cd auction-system
   cp .env.example .env
   # Update .env with your database credentials
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd auction-frontend
   npm install
   npm start
   ```

4. **Docker Setup (Alternative)**
   ```bash
   docker-compose up --build
   ```

## 📚 Documentation

- [API Documentation](http://localhost:8080/swagger-ui.html) (after starting the backend)
- [Admin Endpoints](./ADMIN_ENDPOINTS.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Docker Guide](./DOCKER_GUIDE.md)

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd auction-frontend
npm test
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

[Your Name] - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/auction-system](https://github.com/yourusername/auction-system)

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

---

<div align="center">
  developed by Ndizeye Alain
</div>
