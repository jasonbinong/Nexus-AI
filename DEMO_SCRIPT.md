# Nexus AI Demo Script

Use this for a 60-90 second LinkedIn, portfolio, or application demo.

## Opening

Hi, I am Jason Binong, and this is Nexus AI, a student career operating system I built to help college students manage the full internship preparation process in one place.

Instead of tracking applications, certifications, projects, networking, interview prep, resume notes, and goals across scattered documents, Nexus AI brings those workflows into one dashboard.

## Walkthrough

Start on the dashboard and show the career readiness score.

The dashboard turns workspace data into a career readiness score, weekly priorities, upcoming deadlines, pipeline analytics, and skill-gap recommendations.

Next, add an application.

Here I can add an internship application with company, role, status, deadline, link, and next action. The dashboard updates automatically, so the app becomes a real career tracking system instead of just a static checklist.

Next, show projects and skills.

Students can store portfolio projects with tech stacks, links, stages, and impact notes. They can also track skills with proof, which helps connect resumes to actual evidence.

Next, show the Skills Lab.

Nexus AI compares the student's target role against their saved skills and shows gaps. For example, if the target role is Data Analyst Intern, the app checks for skills like SQL, Excel, Power BI, data analysis, and communication.

Next, mention backend mode.

The public GitHub Pages version works with browser localStorage, but I also built a FastAPI and SQLite backend. When the backend is running locally, the frontend automatically connects to the API and saves workspace data to a real database.

## Closing

This project helped me practice JavaScript state management, frontend UX, API design, database modeling, and full-stack integration. More importantly, it solves a real problem I see for students: career preparation is not one task, it is a system.

My next steps are authentication, PostgreSQL deployment, and connecting CareerLens AI recommendations directly into Nexus AI.
