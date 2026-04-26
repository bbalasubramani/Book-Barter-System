# 📚 Book Barter

Book Barter is a web application that allows users to search, share, and exchange books with others in their community. Built with React and powered by the Open Library API, it provides a simple way to connect book lovers.

## 🚀 Features
- Search books by title or author
- View book details with cover images
- Responsive card-based layout
- API integration with Open Library
- Health check endpoint at `GET /health` for uptime monitors (for example Better Stack)
- Root endpoint at `GET /` for quick platform and monitor checks

## 🛠️ Tech Stack
- React
- JavaScript (ES6+)
- Open Library API
- Vite

## 📦 Installation
```bash
npm install node
npm install mongoose
npm create vite@latest Book-Barter-app
cd Book-Barter-app
npm install
npm run dev
```

## 📄 License
MIT License

## 🔔 Better Stack Uptime Monitor Setup
If your Render free instance sleeps, you can keep an eye on availability with Better Stack:

1. In Better Stack, create a new **HTTP/S monitor**.
2. Set the URL to your deployed backend health endpoint:  
   `https://book-barter-system.onrender.com/health`
3. Set the check frequency (for example, every 3–5 minutes).
4. Alert on non-`200` responses or timeouts.

The API also responds on `GET /` for simple connectivity checks.
