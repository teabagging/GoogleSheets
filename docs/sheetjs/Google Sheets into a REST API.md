# Google Sheets to a REST

How to convert Google Sheets to a REST API and use it in a React application

## summary

Publish data to API has never been so easy. 但Do you use React to publish spreadsheet data to Google Sheets? If not, then this tutorial is for you. This article introduces how to publish spreadsheet data in React via REST API设计POST to Google Sheets。

## Step 1: Create a React application

First, use `create-react-app` to set up your React application.

```bash
npx create-react-app react-googlesheets
```

## Step 2: Install Semantic UI

Semantic UI is a framework for designing and developing beautiful and responsive layouts. It includes various components such as buttons, containers, lists, input boxes, etc.

Install Semantic UI in your React application:

```bash
npm install semantic-ui-react semantic-ui-css
```

After the installation is complete, import the CSS style at the top of the `index.js` file:

```javascript
import 'semantic-ui-css/semantic.min.css';
```

Then run your application:

```bash
npm start
```

## Step 3: Create a table and input box

Use the Semantic UI component to create a form in React, including the name, age, salary, and love etc. input boxes.

The following code is written in `App.js`:

```javascript
import React, { Component } from 'react';
import { Button, Form, Container, Header } from 'semantic-ui-react';
import './App.css';

export default class App extends Component {
 constructor(props) {
 super(props);
 this.state = {
 name: '',
 age: '',
 salary: '',
 hobby: ''
 };
 }

 changeHandler = (e) => {
 this.setState({ [e.target.name]: e.target.value });
 }

 submitHandler = (e) => {
 e.preventDefault();
 console.log(this.state);
 }

 render() {
 const { name, age, salary, hobby } = this.state;
 return (
 <Container fluid className="container">
 <Header as='h2'>React Google Sheets!</Header>
 <Form className="form" onSubmit={this.submitHandler}>
 <Form.Field>
 <label>Name</label>
 <input
 placeholder='Enter your name'
 type="text"
 name="name"
 value={name}
 onChange={this.changeHandler}
 />
 </Form.Field>
 {/* Other input box similar */}
 <Button color="blue" type='submit'>Submit</Button>
 </Form>
 </Container>
 );
 }
}
```

and add some basic styles in `App.css`.

## Step 4: Convert Google Sheets to REST API

1. Open a new Google Sheets document, and name and save it.
2. Set the document permission to public.
3. Visit [https://sheet.best/](https://sheet.best/), register and create a new link, paste your Google Sheets URL.
4. Copy the generated CONNECTION URL, this URL will be used as the endpoint of the POST request.

## Step 5: Install Axios and send a POST request

Install Axios in your React application:

```bash
npm install axios
```

Then use Axios's `submitHandler` function to send a POST request:

```javascript
submitHandler = (e) => {
 e.preventDefault();
 console.log(this.state);
 axios.post('https://sheet.best/api/sheets/a6e67deb-2f00-43c3-89d3-b331341d53ed', this.state)
 .then(response => {
 console.log(response);
 })
}
```

Make sure to replace the URL with your CONNECTION URL from the sheet.

## Step 6: Run and test your application

Now, run your React application, fill out the form and submit it. You should be able to see the submitted data in Google Sheets.

Above are the basic steps to convert Google Sheets to REST API and use it in React applications.You can adjust the table fields and styles according to your needs.

---

This tutorial shows how to send simple spreadsheet data to Google Sheets through a React application, using sheet.best service to simplify the process of setting up the REST API.
