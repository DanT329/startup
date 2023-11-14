# Gym Buddy

## Description deliverable

### Elevator Pitch
Did you know that working out with a partner can increase your motivation, performance, and accountability? The Gym Buddy app connects you with compatible workout partners in your area. With Gym Buddy, you can create your profile, set your preferences, and browse through potential matches based on time of day, type of training, and experience level. Gym Buddy helps you find your perfect workout soul mate, who will motivate you, challenge you, and support you through your fitness journey. If you’re ready to take your workouts to the next level and find your ideal gym partner, use Gym Buddy today!

### Design
Here is a rough mockup for the login/account creation:

![Mock Login](Login_mock.jpg)

Here we have a rough mockup of what the main page might look like while reviewing profiles. I may add a functionality to write a short description of yourself later. You can see other users can leave you a rating after a workout:

![Mock Main](main_mock.jpg)

Here is a mockup of how the application data would be stored and sent:

![Mock database](data_base_flow.jpg)

### Key Features
- Secure Login.
- Ability to view and interact with other user's profiles.
- Ability to change user preferences after account creation.
- Receiving notice when the user profile is selected.
- Ability for two users to send short messages to one another.
- Can leave an "out of 5 review" on other profiles after match.

### Technologies

**Use of Technologies:**
- **HTML** - I will have three HTML pages. One for login, one for viewing profiles, and one for interacting with a match.
- **CSS** - Styling the application in a clean and user-friendly way. No overuse of contrasting colors or flashy visuals.
- **Javascript** - Login support, selecting profiles, display user ratings.
- **Service** - Backend service endpoint:
  - login
  - retrieving profiles
  - submitting match select
  - retrieving match status
  - sending/retrieving messages
- **DataBase** - Store user profiles, matches, and messages.
- **Login** - Log in and create profile. Profile needed to view or interact with other users.
- **WebSocket** - Generate real-time reviews and send chat between users.
- **React** - Application to follow framework.

### HTML Deliverable
- **HTML Pages** -- Added four HTML pages that allow account creation, login, viewing other users, and messaging.
- **Links** -- Account creation button and login button both directly link to the user page. Nav menue present throughout all pages.
- **Textual Content** -- Profiles are described by textual content. All buttons and links are described as well.
- **3rd Party Service Calls** -- Added a placeholder for directly searching Google Maps for near by gyms on the homepage. May later update to include trails or other outdoor activities.
- **Application Images** -- Added a placeholder image for profiles on the messaging page. Not a lot of images will be present on the actual page.
- **Login** -- Created a login page and a account creation page. User name displayed at top of each page other than account creation.
- **Database** -- User page is a placeholder for all account information storage and viewing. Message page also stores information.
- **Websocket** -- Real time updates will be displayed on the Message page, allowing users to communicate with one another.
- **Git Commits** -- Every major update is documented upon commit.

### JavaScript Deliverable
- **Future Login** -- Created a function to check login information. Currently Username is set to: Username and Password is set to: Password. If an inccorect password or username is used an alert will display.
- **Account Creation** -- Home  page allows user to create an account. Information is currently stored in local. Updates username throughout page.
- **Javascript Databases**
  - ***Users Database*** -- On users.html user profiles are generated from an array that holds all  user data. Currently it is stored as local data and is preset. Each time a new user is created at index.html another user will be added to the array. For demonstration purposes it is possible for the current user to interact with their own profile card under users.html. The current users profile will not be visable to themsevles after production is complete.
  - ***Messaging Database*** -- A message card is generated from the user array based on the last profile clicked on. Messages are stored locally and will currently reset on page refresh.
- **Websocket Support** -- Everything is currently stored local but is ready to both send and recieve information from the server.
  - ***Messaging*** -- Users should be able to send and recieve messages. Currently you can only send the message since there is no input from another user to respond. Message is kept in local storage for now.
  - ***Google Maps*** -- For now, integration with Google Maps is on hold. I need to figure out JavaScript API keys from Google. It should be free if the requests are less than a certain amount each month but I want to be sure before committing to creating an account. I'm poor and can't afford to pay Google for using their maps 😢
- **JavaScript Logic** -- Everything seems to work well so far. All the correct pages load on click and the proper functions retrieve and store data.
- **Git Commits** -- Every major update has a commit.
### Services Deliverable
- **HTTP Services Using Node.js** -- Created an index.js page using Express that handles all fetch requests to my page. The public folder is used to generate the application.
-**Static Middleware** -- Express static middleware used to serve up frontend.
-**Third Party Service Call** -- If you navigate to the "Login" page you will find a button that will make a call from boredapi.com and display a suggested activity. To find the "Login" page you must be on the "Home Page". Above account creation, you click "Already Have An Account? Login".
-**BackEnd Service Endpoints** -- The back end has several endpoints that can be called.
  - ***Users Data*** -- All users upon account creation are stored in an array of information. There is both a POST and GET endpoint.
  - ***Messages Data*** -- Messages are stored in "conversations = {}". GET and POST allow manipulation of data. A key is assigned to each message chain within POST endpoint.
  - ***Workouts Data*** -- A GET and POST endpoint is provided for both posting workouts and getting workouts.  The ability to vote on the best workouts is also provided in a separate endpoint.
- ***Frontend Calls Endpoints*** -- Several fetch requests are made on the frontend.
  - ***Users Data*** -- On account creation a POST is made to api/userdata. The user is then taken to the users.html page where a GET request is made for api/userdata. All current users saved on the server are then displayed. For demo purposes, the first account you create will use local storage to save your account. You will also be able to see your own account under users.  This will change after a login system is created. For now, if you would like to test messaging between two users do the following: 1) Create your first account. 2) Open a private browser and create a second account. 3) Message from either one. 4) Click "Update Messages" to see responses. You can also click the bottom buttons to navigate between different conversations.   
  - ***Messages Data*** -- The front end makes two calls to the GET endpoint of api/conversations. Then each time a message is sent it will make a POST to the endpoint of api/conversations. The data is bounced back and forth. Without web sockets, you need to reload the page to update your messages. This allows users to have messaging functionality.
  - ***Workouts Data*** -- The front end will make a GET request to the server to display all current workouts on the server. A POST is made to upload a workout. A POST and GET are made at the same time to update user voting.
- **Git Commits** -- Several git commits are made. I tried to make them descriptive.
- **Some Notes** -- Deleted the Google Maps api call(didn't want to pay for it). Added a "Workouts" page in case messaging gets too complicated in the future and I need to remove it but still have a usable application. Once account authentication is implemented it will lock pages from access. For now, you can browse without having an account and cause some interesting errors if you so choose. All users also have static ratings since it became to complicated to rate users at the moment. I also removed profile photos to save on storage.
