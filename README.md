# 🗳️ Evercare Poll System

A full-stack polling application built with **Spring Boot** and **React**, featuring **real-time poll updates via WebSocket**, secure backend APIs, and a clean, responsive user interface.  
Deployed on a **Linux server** with **PostgreSQL** and **NGINX reverse proxy** for production.

---

## 🚀 Features

- 🧾 **Poll Creation & Management** — Admins can create polls with multiple questions, set answer limits, and control poll lifecycle (`ACTIVE`, `STOPPED`, `COMPLETED`).  
- 🕐 **Real-Time Updates** — Poll results and statuses update instantly via **WebSocket**.  
- 🙋 **Anonymous Voting** — Users can vote without creating accounts. Local storage prevents duplicate votes.  
- 📊 **Dynamic Results** — Live vote counts and progress tracking.  
- 🔒 **Secure Backend** — CORS-protected API and environment-based configuration.  
- ⚙️ **Production-Ready Deployment** — Deployed on Linux using **NGINX**, **systemd**, and **PostgreSQL**.  
- 🧩 **Clean Architecture** — Separation of frontend, backend, and database layers for maintainability.

---

## 🏗️ Tech Stack

**Frontend**
- React (Vite)
- Axios
- TailwindCSS or Bootstrap

**Backend**
- Java Spring Boot
- PostgreSQL
- WebSocket (for live poll updates)
- Maven
- NGINX (reverse proxy)
- Linux (Ubuntu Server)

---
