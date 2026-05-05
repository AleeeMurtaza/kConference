📚 KConference - Agile Conference Management System
KConference is a full-stack web application designed to streamline the research paper submission and review process for academic conferences.

🛠️ Prerequisites (What to Download)
To run this project, you need to have the following installed on your system:

Node.js: Download here (To run the Backend and Frontend)

PostgreSQL: Download here (The Database engine)

pgAdmin 4: (To manage the Database)

VS Code: Download here (Recommended Code Editor)

⚙️ Project Setup Instructions
1. Database Setup (PostgreSQL)
Open pgAdmin 4 and create a new database named conference_db.

Right-click on the database and select Restore (or open the Query Tool).

Use the provided kconference.sql file located in the root folder to import the table structures and initial data.

2. Backend Setup
Open your terminal and navigate to the backend folder: cd backend

Install the required libraries: npm install

Note: If you see a "module not found" error for bcrypt, run: npm install bcrypt

Ensure there is a folder named uploads inside the backend directory.

Start the server: node index.js

The server will run at http://localhost:5000.

3. Frontend Setup
Open a new terminal tab and navigate to the frontend folder: cd frontend

Install the dependencies: npm install

Launch the application: npm start

The app will open in your browser at http://localhost:3000.

👥 Roles & Functionalities
You can test the system using three different user roles:

Author: Can register, login, and upload research papers in PDF format.

Reviewer: Can view all submitted papers and provide feedback (Approve or Reject with comments).

Organiser (Admin): Can view total statistics (Approved vs Pending papers) and oversee all submissions.

📁 Project Structure
Plaintext
KConference_Project/
├── backend/            # Node.js & Express API
│   ├── uploads/        # Directory for stored PDF submissions
│   ├── index.js        # Main entry point
│   └── package.json
├── frontend/           # React.js User Interface
│   ├── src/
│   │   ├── pages/      # Logic for Login, Register, and Dashboard
│   │   └── Auth.css    # Professional unified styling
│   └── package.json
└── kconference.sql     # PostgreSQL Database Export File
Note for the Evaluator
Please ensure that npm install is executed in both the frontend and backend folders before starting the application to ensure all dependencies are correctly loaded.