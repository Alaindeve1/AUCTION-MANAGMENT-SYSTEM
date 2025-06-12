# 🏆 Auction Management System - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white" alt="Material-UI" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

## 📱 Live Demo

Check out our live demo to see the Auction Management System in action:


[<img src="https://cdn-icons-png.flaticon.com/512/0/375.png" alt="Play Video" width="100" />](https://www.loom.com/share/fd0dff316dad4e50ab781445c71947cb?sid=0ffcd0b0-6274-4ab3-90aa-a9d505cb2f48)

## 🚀 Features

### 🏠 User Features
- **User Authentication** - Secure login and registration system with JWT
- **Auction Listings** - Browse and search active auctions with filters
- **Real-time Bidding** - Place bids and receive instant updates
- **User Dashboard** - Track your bids, watchlist, and won items
- **Item Details** - Comprehensive view of auction items with images and descriptions
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 👑 Admin Features
- **User Management** - View and manage all users
- **Auction Management** - Create, edit, and monitor auctions
- **Category Management** - Organize items into categories
- **Bid Monitoring** - Track all bids in real-time
- **Analytics Dashboard** - View system statistics and performance metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Frontend library
- **Redux Toolkit** - State management
- **React Query** - Data fetching and caching
- **Material-UI** - UI components and theming
- **React Router** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **Socket.IO** - Real-time communication
- **Recharts** - Data visualization
- **Vite** - Build tool

### Backend
- **Spring Boot** - Java backend framework
- **Spring Security** - Authentication and authorization
- **JWT** - JSON Web Tokens for authentication
- **WebSocket** - Real-time bid updates
- **PostgreSQL** - Database
- **Hibernate** - ORM

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend server (Auction System)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/auction-frontend.git
   cd auction-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_WS_URL=ws://localhost:8080/ws
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── admin/               # Admin panel components and pages
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common components (buttons, modals, etc.)
│   └── layout/         # Layout components (header, footer, sidebar)
├── contexts/           # React contexts
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   ├── bids/           # Bidding related pages
│   └── items/          # Item listing and detail pages
├── utils/              # Utility functions and helpers
└── App.jsx             # Main application component
```

## 📝 API Documentation

For detailed API documentation, please refer to the [Backend API Documentation](http://localhost:8080/swagger-ui.html) (available when running the backend server).

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- And all the amazing open-source libraries used in this project

---

<div align="center">
  developed by Ndizeye Alain
</div>

