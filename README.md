# 📚 BiblioVault - Library Management System

A full-stack library management system built with **Spring Boot** backend and **Angular** frontend, featuring comprehensive book, author, and member management with lending capabilities.

## 🌟 Live Demo

- **Frontend (Angular)**: [https://bibliovault.netlify.app/](https://bibliovault.netlify.app/)
- **Backend API (Spring Boot)**: [https://bibliovault-api.onrender.com/](https://bibliovault-api.onrender.com/api/library/book)

## 🚀 Features

### 📖 Book Management
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

### 📋 Lending System
- ✅ Book lending and return functionality
- ✅ Track borrowed books per member
- ✅ Real-time availability updates

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

## 📱 Application Screenshots

### 🏠 Home Page
![Home Page](images/home-page.png)
*Main dashboard with quick access to all library functions*

### 📚 Books Management
![Books Page](images/books-page.png)
*Comprehensive book catalog with search and filter options*

![Add Book](images/add-book.png)
*User-friendly book addition form with validation*

### 👨‍💼 Authors Management
![Authors Page](images/authors-page.png)
*Author directory with complete profiles*

![Add Author](images/add-author.png)
*Simple author registration form*

### 👥 Members Management
![Members Page](images/members-page.png)
*Member management with lending history*

![Add Member](images/add-member.png)
*Member registration with profile details*

### 📋 Library Dashboard
![Library Dashboard](images/library-dashboard.png)
*Central hub for all library operations*

### 📖 Book Lending
![Book Lending](images/book-lending.png)
*Intuitive book lending interface*

![Member Books](images/member-books.png)
*Track books borrowed by specific members*

## 🏗️ Architecture

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    Angular 10   │────▶│    Spring Boot   │────▶│    PostgreSQL   │
│    Frontend     │────▶│     REST API     │────▶│     Database    │
│    Netlify      │────▶│      Render      │────▶│     Neon DB     |
└─────────────────┘      └─────────────────┘      └─────────────────┘

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x
- Java 11+
- PostgreSQL database

### Backend Setup

1. **Clone the repository**
git clone https://github.com/lakshaygeek511/BiblioVault.git
cd BiblioVault

text

2. **Configure database**
application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bibliovault
spring.datasource.username=your_username
spring.datasource.password=your_password

text

3. **Run the backend**
./gradlew bootRun

text

Backend will be available at: `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
cd frontend

text

2. **Install dependencies**
npm install --legacy-peer-deps

text

3. **Start development server**
ng serve

text

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

## 📁 Project Structure

BiblioVault/
├── src/ # Spring Boot backend
│ ├── main/
│ │ ├── java/
│ │ │ └── com/bibliovault/api/
│ │ │ ├── controller/ # REST controllers
│ │ │ ├── model/ # Entity models
│ │ │ ├── repository/ # JPA repositories
│ │ │ └── service/ # Business logic
│ │ └── resources/
│ │ └── application*.properties
├── frontend/ # Angular frontend
│ ├── src/
│ │ ├── app/
│ │ │ ├── components/ # Angular components
│ │ │ ├── services/ # API services
│ │ │ └── models/ # TypeScript models
│ │ └── assets/ # Static assets
├── images/ # README screenshots
└── README.md

text

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

---

⭐ **Star this repository if you found it helpful!**
