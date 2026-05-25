# Job Tracker

A full-stack Job Tracker application built with **Django REST Framework** and **React (Vite)**. This project helps users manage job applications, upload resumes, maintain profiles, and track application progress in one place.

---

## Features

* User profile management
* Add and manage job applications
* Upload resumes and profile images
* Notes for job applications
* REST API using Django REST Framework
* React frontend with Vite
* SQLite database support

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SQLite

### Frontend

* React
* Vite
* JavaScript
* CSS

---

## Project Structure

```bash
Job-Tracker/
│
├── backend/          # Django project settings
├── jobs/             # Main Django app
├── frontend/         # React frontend
├── media/            # Uploaded media files
├── manage.py
├── requirements.txt
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bencyb/job-tracker.git
cd job-tracker
```

---

## Backend Setup

### Create Virtual Environment

```bash
python -m venv env
```

### Activate Virtual Environment

#### Windows

```bash
env\Scripts\activate
```

#### Mac/Linux

```bash
source env/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Migrations

```bash
python manage.py migrate
```

### Start Django Server

```bash
python manage.py runserver
```

Backend runs at:

```bash
http://127.0.0.1:8000/
```

---

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173/
```

---

## API Features

* Create job applications
* Update application status
* Upload resumes
* Add personal notes
* Manage profile data

---

## Environment Variables

Create a `.env` file if required for secret keys or custom settings.

Example:

```env
DEBUG=True
SECRET_KEY=your_secret_key
```

---

## Future Improvements

* Authentication system
* Dashboard analytics
* Job filtering and search
* Email reminders
* Deployment support

---

## Author

Created by Bency Baby.

GitHub: [https://github.com/bencyb](https://github.com/bencyb)
