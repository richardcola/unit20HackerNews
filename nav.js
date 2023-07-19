/* JavaScript file, nav.js */

// Submit login form
async function login(evt) {
  evt.preventDefault();

  const username = $('#login-username').val();
  const password = $('#login-password').val();

  const response = await axios.post(`${BASE_API_URL}/login`, {
    user: { username, password },
  });
  
  const { user } = response.data;

  saveUserCredentials(user);

  currentUser = new User(user.username, user.token);
  await currentUser.retrieveDetails();
  showUserProfile();
  await generateStories();
  $storiesList.show();
}

// Submit signup form
async function signup(evt) {
  evt.preventDefault();

  const name = $('#signup-name').val();
  const username = $('#signup-username').val();
  const password = $('#signup-password').val();

  const response = await axios.post(`${BASE_API_URL}/signup`, {
    user: { name, username, password },
  });

  const { user } = response.data;

  saveUserCredentials(user);

  currentUser = new User(user.username, user.token);
  await currentUser.retrieveDetails();
  showUserProfile();
  await generateStories();
  $storiesList.show();
}

// Save user credentials to local storage
function saveUserCredentials(user) {
  localStorage.setItem('token', user.token);
  localStorage.setItem('username', user.username);
}
