# Google Sheets Application Project (*in progress*)
Google Sheets application in Node.js

## Prerequisites to run this application
 - Node.js & npm installed.
 - After downloading the git repository, run the following command to install the application dependencies: 
    npm install express googleapis 
- (Optional) you may install Nodemon if you want the app to restart automatically while file changes in the directory are detected. To install nodemon globally, run the following code: 
    npm install -g nodemon
- Create a Google Cloud Platform project with the Google Sheets API enabled. To learn how to create a project and enable the API, refer to https://developers.google.com/workspace/guides/create-project.
- Authorization credentials. For this project, we are going to use the API keys as credentials. To learn how to create an API key, refer to https://developers.google.com/sheets/api/guides/authorizing#APIKey.
- Rename the API key to "cred.json" and place it in the root directory of the application (probably called "googlesheets-app").

## Running the project
- At first change the directory to the public folder by running the code:
    cd public
- To run the application,  use the following command: 
    node index
- If nodemon is installed, just run the code:
    nodemon
- The app is going to execute everytime you enter the page "localhost:8080/app/metadata".
