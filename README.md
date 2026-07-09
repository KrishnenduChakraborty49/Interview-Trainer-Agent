<h1 align="center">🚀 AI-Powered Interview Trainer Agent</h1>

<p align="center">
  <b>An intelligent, autonomous technical interview preparation platform powered by IBM watsonx.ai.</b><br>
  <i>Developed as a final project submission for the IBM University Engagement / Edunet Foundation Internship.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/IBM_Watsonx-0f172a?style=for-the-badge&logo=ibm&logoColor=white" />
</p>

---

## 📖 About The Project

Job seekers often struggle to prepare for technical interviews due to a lack of realistic practice and objective feedback. 
The **Interview Trainer Agent** is a full-stack, Agentic AI solution designed to bridge this gap. Instead of relying on static questionnaires, this platform dynamically generates custom technical questions based on the candidate's target skills and evaluates their verbal or written answers in real-time.

### 🌟 What makes this project unique?
While traditional approaches might use drag-and-drop tools like Langflow, this project was built entirely from scratch using a **Custom Java Spring Boot Architecture**. 
* **Enterprise-Grade AI Orchestration:** Integrated directly with the **IBM Granite-3-8b-instruct** model via custom Java REST APIs.
* **Resilient JSON Parsing:** Features a custom-built error-handling system that intelligently parses unpredictable LLM text into strict JSON payloads, ensuring the frontend never crashes.
* **Multi-Modal Interaction:** Simulates real interviews by allowing users to answer questions using their microphone (Web Speech API) or by typing.
* **Premium UX/UI:** Designed with a "gigantic", highly animated frosted-glass interface powered by Framer Motion.

---

## ✨ Key Features

- 🎤 **Voice-to-Text Integration:** Speak your answers naturally with the interactive glowing microphone.
- 🧠 **Dynamic Question Engine:** The AI acts as a hiring manager, generating unique questions and hidden "Expected Key Points" for every session.
- 📊 **Objective Evaluation:** Receive an instant score (0-100) and actionable feedback on how well your answer matched the expected technical criteria.
- 📈 **Performance Dashboard:** Track your historical interview scores visualized through beautiful Recharts analytics.
- 🛡️ **Fail-Safe Fallbacks:** Built-in backend fallbacks ensure continuous application uptime even if IBM Cloud rate limits are reached.

---

## 🏗️ Architecture Blueprint

1. **Client Tier:** React, Vite, TailwindCSS, Framer Motion
2. **Server Tier:** Java 25, Spring Boot 3, REST Controllers
3. **Data Tier:** MySQL, Hibernate/JPA
4. **Cloud Tier:** IBM Cloud IAM, IBM watsonx.ai (`ibm/granite-3-8b-instruct`)

---

## 🚀 Step-by-Step Setup Instructions

Follow these instructions to run the project locally on your machine.

### Prerequisites
* Java 17 or higher (Java 25 recommended)
* Node.js (v18+)
* MySQL Server (Running on port 3306)
* An active **IBM Cloud API Key** and **Watsonx Project ID**

### 1. Database Setup
Create a new MySQL database named `interview_trainer`.
```sql
CREATE DATABASE interview_trainer;
```

### 2. Backend Setup (Spring Boot)
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open `src/main/resources/application.properties` and add your database credentials and IBM Cloud keys:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ibm.cloud.api-key=YOUR_IBM_API_KEY
   ibm.watsonx.project-id=YOUR_WATSONX_PROJECT_ID
   ```
3. Run the Spring Boot server:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The server will start on `http://localhost:8080`)*

### 3. Frontend Setup (React)
1. Open a new, separate terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the required NPM packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The application will launch on `http://localhost:5173`)*

---

## 🔮 Future Scope
* **Video & Facial Expression Analysis:** Integrating OpenCV or WebRTC to monitor posture, eye contact, and micro-expressions to train candidates on non-verbal communication.
* **AI-Powered Voice Synthesis:** Implementing Text-to-Speech (TTS) and real-time translation models so the AI can speak back to the user in multiple languages for international interview prep.

---

## 🤝 Acknowledgements
Special thanks to the **Edunet Foundation** and **IBM University Engagement** for providing the platform, tools, and opportunity to develop this Agentic AI solution.
