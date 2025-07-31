# 📚 BiblioVault - Library Management System

A full-stack library management system built with **Spring Boot** backend and **Angular** frontend, featuring comprehensive book, author, and member management with lending capabilities.

## 🌟 Live Demo

- **Frontend (Angular)**: [https://bibliovault.netlify.app/](https://bibliovault.netlify.app/)
- **Backend API (Spring Boot)**: [https://bibliovault-api.onrender.com/](https://bibliovault-api.onrender.com/api/library/book)

## 🚀 Features

### 🏠 Home Page ( 📋 Library / Lending System )
<img width="1347" height="672" alt="image" src="https://github.com/user-attachments/assets/85200997-98cf-490f-a856-592b58117767" />
Main dashboard with quick access to all library functions

- ✅ Book lending and return functionality
- ✅ Track borrowed books per member
- ✅ Real-time availability updates

### 📚 Books Management
<img width="1342" height="665" alt="image" src="https://github.com/user-attachments/assets/1a58badc-d902-4d30-8603-15d1315c0a98" />
Comprehensive book catalog with search and filter options
User-friendly book addition form with validation

- ✅ Add, edit, and delete books
- ✅ ISBN validation and duplicate checking
- ✅ Search books by title, author, or ISBN
- ✅ Track book availability status

### 👨‍💼 Author Management
- ✅ Manage author profiles
- ✅ Link authors to multiple books
- ✅ View author's complete bibliography

### 👥 Member Management
- ✅ Member registration and profile management
- ✅ Track member lending history
- ✅ View available books for specific members

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 2.3.4
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Hibernate/JPA
- **Build Tool**: Gradle
- **Deployment**: Render

### Frontend
- **Framework**: Angular 10
- **UI Library**: Angular Material + Bootstrap
- **Build Tool**: Angular CLI
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x
- Java 11+
- PostgreSQL database

### Backend Setup

1. **Clone the repository**
git clone https://github.com/lakshaygeek511/BiblioVault.git
cd BiblioVault

2. **Configure database**
application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bibliovault
spring.datasource.username=your_username
spring.datasource.password=your_password

3. **Run the backend**
./gradlew bootRun
Backend will be available at: `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
cd frontend
2. **Install dependencies**
npm install --legacy-peer-deps
3. **Start development server**
ng serve
Frontend will be available at: `http://localhost:4200`

## 📊 API Endpoints

### Books
- `GET /api/library/book` - Get all books
- `POST /api/library/book` - Create new book
- `GET /api/library/book/{id}` - Get book by ID
- `PATCH /api/library/book/{id}` - Update book
- `DELETE /api/library/book/{id}` - Delete book

### Authors
- `GET /api/library/author` - Get all authors
- `POST /api/library/author` - Create new author

### Members
- `GET /api/library/member` - Get all members
- `POST /api/library/member` - Create new member
- `PATCH /api/library/member/{id}` - Update member

### Lending
- `POST /api/library/book/lend` - Lend books to member
- `GET /api/library/member/{id}/lentbooks` - Get member's borrowed books
- `GET /api/library/member/{id}/availablebooks` - Get available books for member

## 🌐 Deployment

### Backend (Render)
1. Connect GitHub repository to Render
2. Configure environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Your Netlify frontend URL

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Build settings:
- **Build command**: `npm install --legacy-peer-deps && ng build --configuration=production`
- **Publish directory**: `dist/springboot-angular10-crud`
- **Node version**: 16.20.0

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lakshay Geek**
- GitHub: [@lakshaygeek511](https://github.com/lakshaygeek511)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- Bootstrap and Angular Material for UI components
- Render and Netlify for seamless deployment
