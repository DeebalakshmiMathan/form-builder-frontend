# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

 1. git clone (repo link)
 2. npm install
 3. npm run dev

**🚀 Technologies Used**

React.js 18

JavaScript (ES6+)

Redux Toolkit

React Redux

React Router DOM

Axios

Tailwind CSS

Vite

**✨ Features**

Admin Features

Admin login and authentication

Protected admin routes

Create dynamic forms

Edit and delete forms

Add different field types

Configure field labels, placeholders, and validation

Mark fields as required

Live form preview

Save forms as drafts

Publish forms

View form submissions

View individual submission details

Delete submissions

Pagination for submissions

Public User Features

Access published forms

Dynamic form rendering

Client-side form validation

Submit form responses

Display successful submission message

Admin Features

Admin login and authentication

Protected admin routes

Create dynamic forms

Edit and delete forms

Add different field types

Configure field labels, placeholders, and validation

Mark fields as required

Live form preview

Save forms as drafts

Publish forms

View form submissions

View individual submission details

Delete submissions

Pagination for submissions

Public User Features

Access published forms

Dynamic form rendering

Client-side form validation

Submit form responses

Display successful submission message

**Pages**
1. Login Page
     valid admin can enter into the form builder page

2. formbuilder page
      1. add new form
      can create dynamic form
      2.we can see created form here
      submitted form we can get by copie the link whish is shown in the table
      need to copied url sepratly we can get created form here we need to enter form detail and submit then we can see the submited form list
3.Submissions Page
    while clicking "submissions" in formbuilder page it navigate to the submitted form list
4. Public form page
     copy the link in formbuilder page and paste new tap we can get created for here we can fill the form and submit
   Edit:
   edit will navigate the form by form id
   Delete:
   Delete the form also by form id
   in create new form and edit form's  submit (preview) button not connected with api it just need to get know all required fields are filed
   so need to publish the created form

