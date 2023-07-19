/* JavaScript file, models.js */

// Story class
class Story {
  constructor({ title, author, url, username, storyId }) {
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.storyId = storyId;
    this.favorites = [];
  }

  // Check if a story is already a favorite
  isFavorite(user) {
    return this.favorites.some(favorite => favorite.username === user.username);
  }

  // Set the hostname for a story's URL
  getHostName() {
    return new URL(this.url).host;
  }
}

// User class
class User {
  constructor(username, token) {
    this.username = username;
    this.token = token;
    this.name = '';
    this.createdAt = '';
    this.favorites = [];
    this.ownStories = [];
  }

  // Add a favorite story
  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite('add', story);
  }

  // Remove a favorite story
  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite('remove', story);
  }

  // Retrieve user details
  async retrieveDetails() {
    const response = await axios.get(`${BASE_API_URL}/users/${this.username}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    const { user } = response.data;

    this.name = user.name;
    this.createdAt = user.createdAt;
    this.favorites = user.favorites.map(s => new Story(s));
    this.ownStories = user.stories.map(s => new Story(s));
  }

  // Send a POST request to add or remove a favorite
  async _addOrRemoveFavorite(action, story) {
    const method = action === 'add' ? 'POST' : 'DELETE';
    await axios({
      url: `${BASE_API_URL}/users/${this.username}/favorites/${story.storyId}`,
      method,
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }
}

// StoryList class
class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  // Get all stories from the API
  static async getStories() {
    const response = await axios.get(`${BASE_API_URL}/stories`);
    const stories = response.data.stories.map(s => new Story(s));
    return stories;
  }

  // Add a new story
  static async addStory(user, newStory) {
    const response = await axios({
      url: `${BASE_API_URL}/stories`,
      method: 'POST',
      data: {
        token: user.token,
        story: newStory,
      },
    });

    const story = new Story(response.data.story);
    user.ownStories.push(story);
    return story;
  }

  // Remove a story
  static async removeStory(user, storyId) {
    await axios({
      url: `${BASE_API_URL}/stories/${storyId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` },
    });

    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
  }
}
