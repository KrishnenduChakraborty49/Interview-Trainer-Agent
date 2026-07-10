<h1 align="center">🚀 AI-Powered Interview Trainer Agent</h1>

<p align="center">
  <b>An intelligent, autonomous technical interview preparation platform powered by IBM watsonx.ai.</b><br>
  <i>Developed as a final project submission for the IBM University Engagement / Edunet Foundation Internship.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0--production-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/IBM_Watsonx-0f172a?style=for-the-badge&logo=ibm&logoColor=white" />
</p>

---

## 📖 About The Project

Job seekers often struggle to prepare for technical interviews due to a lack of realistic practice and objective feedback. 
The **Interview Trainer Agent** is a full-stack, Agentic AI solution designed to bridge this gap. Instead of relying on static questionnaires, this platform dynamically generates custom technical questions based on the candidate's target skills and evaluates their verbal or written answers in real-time.

### 🌟 The "No-Code" Alternative vs. True Engineering
While traditional internship approaches might rely on "no-code" drag-and-drop workflow tools like Langflow, this platform was engineered entirely from scratch using a **Custom Java Spring Boot Architecture**. This approach guarantees enterprise-grade security, extreme customization, and the ability to handle complex edge cases that drag-and-drop builders cannot.

---

## 🧩 A Dual-Client Ecosystem (Satisfying the Problem Statement)

The official problem statement requires that *"Users can input their resume or job title, and the agent provides targeted questions, model answers, and improvement tips."* To completely satisfy this across all dimensions, this project features a single robust Java Spring Boot backend that powers **two distinct client interfaces**:

1. **The Live Practice Interface (React App):** Users input their *Job Title* and *Experience Level* into the custom React frontend to conduct a real-time, voice-enabled mock technical interview.
2. **The Resume Analyzer Interface (IBM Watsonx Orchestrate):** Users upload their *Resume* directly into the enterprise IBM Watsonx Orchestrate UI, which securely connects to the Java backend via an Ngrok OpenAPI tunnel to generate an 8-week learning roadmap and skill-gap analysis.

---

## 🛡️ Production-Ready Engineering

This application was engineered with strict **Production-Level** standards in mind, ensuring it is secure, scalable, and resilient.

1. **Intelligent Fallback Mechanisms (High Availability):**
   * If the IBM Watsonx API rate-limits the application or experiences downtime, the Spring Boot backend automatically catches the exception and routes to a hardcoded fallback response. This guarantees a **100% uptime UX** where the frontend will never crash or display a "White Screen of Death."
2. **Resilient JSON Parsing Engine:**
   * LLMs are notorious for returning malformed JSON (e.g., adding conversational text or missing brackets). The backend utilizes a custom Regex and substring parsing engine to extract and sanitize the JSON payload *before* passing it to the Jackson ObjectMapper. 
3. **Environment Variable Security:**
   * No hardcoded API keys. All database credentials and IBM Cloud Identity access tokens are strictly managed via `application.properties` and injected via `@Value` annotations, adhering to OWASP security standards.
4. **CORS & Cross-Origin Security:**
   * The REST API is secured with strict Cross-Origin Resource Sharing (CORS) configurations, ensuring that only the authorized React frontend domain can invoke the AI orchestration endpoints.
5. **Optimized Frontend Assets:**
   * The React frontend utilizes Vite for lightning-fast Hot Module Replacement (HMR) during development and heavily minified, tree-shaken bundles for the production build.

---

## ✨ Core Features

- 🎤 **Voice-to-Text Integration:** Speak your answers naturally with the interactive glowing microphone powered by the Web Speech API.
- 🧠 **Dynamic Question Engine:** The Agentic AI acts as a hiring manager, generating unique questions and hidden "Expected Key Points" for every session.
- 📊 **Objective Evaluation:** Receive an instant score (0-100) and actionable feedback on how well your answer matched the expected technical criteria.
- 📈 **Performance Analytics:** Track your historical interview scores visualized through beautiful, responsive Recharts analytics.
- 💅 **Premium UX/UI:** Designed with a "gigantic", highly animated frosted-glass interface (Glassmorphism) powered by Framer Motion.

---

## 🏗️ System Architecture & Data Flow

<img width="1141" height="922" alt="Screenshot 2026-07-07 203055" src="https://github.com/user-attachments/assets/b49cbfaf-bf60-486d-83a0-e5240b258ee2" />


---

## 🔌 API Documentation
The backend exposes a highly structured, RESTful interface:
* `POST /api/agent/tools/generate-question` - Ingests `targetSkill` and `difficultyLevel` and returns an AI-generated question with expected key points.
* `POST /api/agent/tools/evaluate-answer` - Ingests the `candidateAnswer` and evaluates it against the hidden key points to return a `confidenceScore`.
* `GET /api/history` - Fetches the candidate's historical interview sessions.

---

## 🚀 Step-by-Step Setup Instructions

Follow these instructions to run the project locally on your machine.

### Prerequisites
* Java 17 or higher (Java 25 recommended)
* Node.js (v18+)
* MySQL Server (Running on port 3306)
* An active **IBM Cloud API Key** and **Watsonx Project ID**
* *(Optional)* Docker Desktop

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

### 4. Docker Deployment (Alternative to Steps 1-3)
Because this project is fully containerized, you can skip local setup and run the entire stack (Database, Backend, and Frontend) instantly using Docker:
1. Ensure your IBM credentials are set in the `docker-compose.yml` environment variables.
2. Open a terminal in the root folder and run:
   ```bash
   docker-compose up -d --build
   ```

### 5. IBM Watsonx Orchestrate & Ngrok Integration
If you wish to use the IBM Watsonx Orchestrate enterprise UI to analyze resumes and generate 8-week roadmaps:
1. Start your Spring Boot backend locally (Step 2).
2. Start an Ngrok tunnel in a new terminal: `ngrok http 8080`
3. Open `openapi.json` (in the root directory) and replace the placeholder URL with your new Ngrok forwarding URL.
4. Go to the **IBM Watsonx Orchestrate** dashboard, import `openapi.json` as a custom skill, and assign the `generateQuestion` and `evaluateAnswer` endpoints to your Agent.
5. You can now chat directly with your IBM cloud agent, and it will route requests securely to your local Java backend!

---

## 🔮 Future Scope
* **Video & Facial Expression Analysis:** Integrating OpenCV or WebRTC to monitor posture, eye contact, and micro-expressions to train candidates on non-verbal communication.
* **AI-Powered Voice Synthesis:** Implementing Text-to-Speech (TTS) and real-time translation models so the AI can speak back to the user in multiple languages for international interview prep.

---

## 🤝 Acknowledgements
Special thanks to the **Edunet Foundation** and **IBM University Engagement** for providing the platform, tools, and opportunity to develop this Agentic AI solution.
