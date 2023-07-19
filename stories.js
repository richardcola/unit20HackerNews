/* JavaScript file, stories.js */

// Story submission form
async function submitStory(evt) {
  evt.preventDefault();

  const author = $('#author').val();
  const title = $('#title').val();
  const url = $('#url').val();

  const newStory = { author, title, url };
  const story = await StoryList.addStory(currentUser, newStory);

  const $story = generateStoryMarkup(story);
  $storiesList.prepend($story);

  $('#submit-story-form').trigger('reset');
}

// Remove a story from the DOM and API
async function removeStory(evt) {
  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  await StoryList.removeStory(currentUser, storyId);

  $closestLi.remove();
}

// Event listeners
$('#submit-story-form').on('submit', submitStory);
$('#all-stories-list').on('click', '.fa-trash', removeStory);
