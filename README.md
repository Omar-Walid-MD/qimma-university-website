
# Al Qimma University

  

![Al Qimma University Logo](https://al-qimma-university.netlify.app/static/media/logo.930e47726e0be7f619cc.png)

  

## Website URL

  

Visit the live demo: [Al Qimma University](https://al-qimma-university.netlify.app)

  

## Project Overview

  

Al Qimma University is a website for a suppository university that showcases the university's faculties, departments, and courses. The student profile views all the registered information about a student and their evaluations for previous and current courses.

  

### Technologies Used

- **Frontend**: React

- **Styling**: CSS, Bootstrap

- **State Management**: Redux

- **Form Management**: Yup

- **Routing**: React Router

- **Backend**: Node.js, Express.js

- **Database**: MySQL

  

## Pages

- **Home**: Home page with an overview about the university and different sections that lead to the other pages.

  

- **Faculties**: Shows all the faculties in the university.

  

- **Faculty Info**: Overview of a chosen faculty and its departments.

  

- **Department Info**: Overview of a chosen department and its courses.

  

- **Student Profile**: Shows the logged in student's information.

  

- **Application**: Handles the application form.

  

- **Admin Dashboard Pages**: Allows admins to view and filter through the data of students and professors.

  
  

## How to Install and Run the Project Locally

  

If you wish to run **Al Qimma University** on your local machine, follow these steps:

  
1. Clone the repository:
```bash
git clone https://github.com/Omar-Walid-MD/qimma-univeristy-website.git
```

  

2. Navigate into the project directory:
```bash
cd qimma-university-website
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Install MySQL client and start server

6. Run data.sql (./src/Data/data.sql) in MySQL

7. Create .env with the following properties and fill in the values from your MySQL client

```
REACT_APP_SQL_HOST=value
REACT_APP_SQL_USER=value
REACT_APP_SQL_DATABASE=value
REACT_APP_SQL_PASS=value
REACT_APP_SQL_PORT=value
```