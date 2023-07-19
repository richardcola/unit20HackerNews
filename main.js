/* JavaScript file, main.js */

// Constants
const BASE_API_URL = 'https://hack-or-snooze-v3.herokuapp.com';
const $storiesList = $('#all-stories-list');
const $navLogin = $('#nav-login');
const $navUserProfile = $('#nav-user-profile');
const $navLogout = $('#nav-logout');
const $navAll = $('#nav-all');

// State
let currentUser;
let storyList;

// On page load
async function start() {
  await checkIfLoggedIn();
  await generateStories();
  $storiesList.show();
}

// Check if the user is already logged in
async function checkIfLoggedIn() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    currentUser = new User(username, token);
    await currentUser.retrieveDetails();
    showNavForLoggedInUser();
  }
}

// Generate stories list
async function generateStories() {
  const stories = await storyList.getStories();
  storyList = new storyList(stories);

  $storiesList.empty();

  stories.forEach(function (story) {
    const $story = generateStoryMarkup(story);
    $storiesList.append($story);
  });
}

// Generate markup for a single story
function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  const starType = showStar && currentUser.isFavorite(story) ? 'fas' : 'far';

  const storyMarkup = $(`
    <li id="${story.storyId}">
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>
      <a href="${story.url}" class="story-link">
        ${story.title}
      </a>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user hidden">posted by ${story.username}</small>
    </li>
  `);

  storyMarkup.on('click', '.fa-star', toggleStoryFavorite);
  return storyMarkup;
}

// Toggle a story's favorite status
async function toggleStoryFavorite(evt) {
  const $target = $(evt.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass('fas')) {
    await currentUser.removeFavorite(story);
    $target.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFavorite(story);
    $target.closest('i').toggleClass('fas far');
  }
}

// Show the user's favorite stories
function showFavorites() {
  const favStories = currentUser.favorites;
  $storiesList.empty();

  if (favStories.length === 0) {
    $storiesList.append("<h5>No favorites added!</h5>");
  } else {
    favStories.forEach(function (story) {
      const $story = generateStoryMarkup(story);
      $storiesList.append($story);
    });
  }
}

// Show the logged-in user's stories
async function showMyStories() {
  $storiesList.empty();

  if (currentUser.ownStories.length === 0) {
    $storiesList.append("<h5>No stories added by user yet!</h5>");
  } else {
    currentUser.ownStories.forEach(function (story) {
      const $story = generateStoryMarkup(story);
      $storiesList.append($story);
    });
  }
}

// Show the user's own stories and the user profile
function showUserPage() {
  $storiesList.empty();
  showUserProfile();
  showMyStories();
}

// Show the user profile
function showUserProfile() {
  $('#profile-name').text(`Name: ${currentUser.name}`);
  $('#profile-username').text(`Username: ${currentUser.username}`);
  $('#profile-account-date').text(`Account Created: ${currentUser.createdAt}`);
  $navUserProfile.text(`${currentUser.username}`);
  $navUserProfile.show();
  $navLogin.hide();
  $navLogout.show();
}

// Log out the user
function logout(evt) {
  localStorage.clear();
  location.reload();
}

// Show the navigation bar for a logged-in user
function showNavForLoggedInUser() {
  $navLogin.hide();
  $navLogout.show();
  $navUserProfile.text(currentUser.username);
  $navUserProfile.show();
}

// Event Listeners
$navLogin.on('click', () => {
  $storiesList.hide();
  $('.account-form').toggleClass('hidden');
});

$navAll.on('click', () => {
  $storiesList.show();
  $('.account-form').addClass('hidden');
});

$navUserProfile.on('click', showUserPage);

$navLogout.on('click', logout);

$('#login-form').on('submit', login);

$('#signup-form').on('submit', signup);

// On page load, start the app
$(start);
