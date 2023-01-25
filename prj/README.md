# CMPT 373: Team Venus

## Project Intro
This is a project for the BayTree charity in CMPT 373. It is meant to integrate the interaction between Views, the database used by BayTree, and the admin/mentor/mentee. We have divided the structure of the project into the mobile flutter app, the Express Node for backend server, and React front-end for the administrator.

## Flutter Mobile App
- Code written in the flutter_app folder mostly resides in the lib folder. In lib folder, we have the following directories
    - model - stores models we use such as sessions, staff, notes, etc.
    - screens - the different screens of the app. Each screen has a folder of its own containing the screen code and any local widgets
    - services - the services we use for interacting with Views, and the backend for the user login 
    - utils - utility classes used throughout the app such as building requests, parser, etc.
    - widgets - widgets used throughout the app

- The dependencies for the flutter app can be found in this file path: `./flutter_app/pubspec.yaml`

### Steps to Run
  1. Create a .env file in the root of the `flutter_app` directory<br>
    - Paste the following into it:
```
username = 'group.venus'
password = 'CMPTV3nu$123'
```
  2. Run `flutter pub get` in the `flutter_app` directory
  3. Still in the `flutter_app` directory, run `flutter run`

## Backend Server

For our project, we have chosen to use Node.js with the Express framework. The vast majority of the code related to the backend can be found in the `backend` folder. In `backend`, we have the following subdirectories:
- `src` - For all TypeScript code written by us.
  - `endpoints` - Defines any endpoints to reach our server
  - `models` - Defines models/schemas for documents, note that we are using Mongoose/MongoDB
  - `util` - Contains any modules that will be used in multiple places
- `build` - Contains the JavaScript code that was created as a result of compiling the TypeScript code found in `src` 

Additionally, there is a `shared` folder which can be found from the root directory, which contains any modules that are used in both the frontend and backend.

The dependencies for this node app can be found in `./backend/package.json`

### Steps to Run

1. Create a .env file, put it in the root of the `backend` directory
  - Paste the following into it:
  ```
  PORT=3000

  VIEWS_USERNAME=group.venus
  VIEWS_PASSWORD=CMPTV3nu$123

  MAILER_EMAIL=baytree.venus@yahoo.com
  MAILER_PASSWORD=xkyfeayabtgaohnr

  MONGODB_USERNAME=mongodb
  MONGODB_PASSWORD=mongodb

  JWT_SECRET=f2af3cec1e3f28bf66f4b8e00c7d7acff23b7b4bdb257150f035e6d64e34d3fb
  ```
2. Run `npm install`, in the `backend` directory
3. Still in the `backend` directory, run `npm start`


## Frontend
- The react application has a file structure similar to typical Next.js applications
    - pages - includes the separte pages we would see in the admin dashboard
    - interfaces - defines the data types that will be used within the pages/components 
    - components - includes react components that modularize content and be used in pages
    - public - public assests such as images

- The dependencies can be fround in the package.json file: `./frontend/package.json`

### Steps to Run

  1. Create a `.env.local` file, put it in the root of the `frontend` directory
  - Paste the following into it:
  ```
  TOKEN_SECRET=5b437e7b12ccd7d47160a46a05d98552dbb2f8106ee78c12d032e744d9c46f11 
  ```
  2. Run `npm install` in `frontend` directory
  3. Then `npm run build`
  4. and then `npm run dev` to run the development server
    
- The application runs on localhost:5000