/* JavaScript file, user.js */

// User profile update form
async function updateProfile(evt) {
  evt.preventDefault();

  const name = $('#update-name').val();
  const password = $('#update-password').val();

  const response = await axios.patch(
    `${BASE_API_URL}/users/${currentUser.username}`,
    {
      token: currentUser.token,
      user: { name, password },
    }
  );

  const { user } = response.data;

  currentUser.name = user.name;
  currentUser.createdAt = user.createdAt;
  $('#profile-name').text(`Name: ${currentUser.name}`);
  $('#profile-account-date').text(`Account Created: ${currentUser.createdAt}`);
}

// Add event listener for profile update form
$('#update-profile-form').on('submit', updateProfile);
