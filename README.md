
# 🎯 Focus Lock

> **An intelligent productivity platform for distraction free digital learning.**


---

## 📖 Project Overview

**Focus Lock** is a **Final Year Engineering Team Project** developed to create a distraction free digital learning environment for students. The application combines a modern web dashboard with a Chrome Extension to help students reduce digital distractions, monitor study sessions, and gain meaningful productivity insights.

This repository serves as the primary codebase for the project and is actively maintained as development continues.

> **Current Status:** 🚧 This project is actively under development.

---

## 💡 Why Focus Lock?

Online learning has made studying more accessible but also more distracting. Smart Focus Lock was created to help students maintain focus by combining website blocking, study tracking, and productivity analytics into one seamless platform.

Rather than simply restricting access to distracting websites, the project encourages better study habits through insightful analytics and an intuitive user experience.

---

## ✨ Key Features

| Feature                       | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| 🔐 **Secure Authentication**  | User registration and login system                    |
| 🌐 **Website Blocking**       | Block distracting websites through a Chrome Extension |
| 📚 **Study Session Tracking** | Track and manage focused study sessions               |
| 📊 **Productivity Analytics** | Visual insights into study performance                |
| 📡 **Real-Time Monitoring**   | Monitor blocked website attempts instantly            |
| ⚙️ **Custom Settings**        | Personalize your study experience                     |
| 🎨 **Modern Dashboard**       | Responsive and user-friendly interface                |

> **Note:** Additional features are currently being developed as part of the project's future scope.

---

## 🛠️ Technology Stack

| Layer                | Technologies                    |
| -------------------- | ------------------------------- |
| 🎨 Frontend          | React • Vite • JavaScript • CSS |
| ⚙️ Backend           | Node.js • Express.js            |
| 🗄️ Database         | SQLite                          |
| 🧩 Browser Extension | Chrome Extension (Manifest V3)  |
| 🔗 API               | REST APIs                       |
| 🌱 Version Control   | Git • GitHub                    |

---

## 🏛️ System Architecture

```text
                  ┌────────────────────┐
                  │  Chrome Extension  │
                  └─────────┬──────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │  Express Backend   │
                  └─────────┬──────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌────────────────┐        ┌─────────────────┐
      │ React Frontend │        │ SQLite Database │
      └────────────────┘        └─────────────────┘
```

---

## 📂 Project Structure

```text
Smart-Focus-Lock/
│
├── backend/         # Express backend & SQLite database
├── frontend/        # React (Vite) web application
├── extension/       # Chrome Extension (Manifest V3)
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-focus-lock
```

### 2. Start the Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend runs on:

```text
http://localhost:4000
```

---

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

### 4. Load the Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension` folder
5. Sign in using the same account created on the dashboard
6. Add websites from the **Website Blocker** page
7. Start a distraction-free study session 🎯

---

## 👥 Team Contributions

### **Shubha** 

* Developed the frontend interface and user experience.
* Designed responsive dashboard pages.
* Managed GitHub repository and project documentation.
* Implemented website blocking functionality.

### **Pragna**

* Designed the overall system architecture.
* Developed the Chrome Extension.
* Coordinated project deliverables.
* Tested, debugged, and refined the application.

### **Kavya**

* Developed backend services and REST APIs.
* Implemented authentication and database integration.
* Optimized backend functionality.

### **Kruthika**

* Implemented website blocking functionality.
* Integrated the extension with the backend.
* Assisted with planning, documentation, and testing.

---

## 🚀 Future Scope

The project is continuously evolving. Planned enhancements include:

* AI-powered focus recommendations
* Smarter productivity insights
* Cross-device synchronization
* Mobile application support
* Enhanced analytics and reporting
* Improved personalization features

---

## 🙏 Acknowledgements

This project is being developed as part of our **Final Year Engineering Project**.

We sincerely thank our project guide, faculty members, and teammates for their continuous support, guidance, and encouragement throughout the development of this project.

---

⭐ *If you found this project interesting, consider giving it a star.*



