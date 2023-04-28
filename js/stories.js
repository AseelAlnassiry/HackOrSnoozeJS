'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="${currentUser.checkFavorites(story) ? 'fas' : 'far'} fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Submit handler for stories
const handleAddStory = async (e) => {
  e.preventDefault();
  const author = $('#formAuthor').val();
  const title = $('#formTitle').val();
  const url = $('#formUrl').val();
  const newStory = await storyList.addStory(currentUser, { title, url, author });
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $addStoryForm.toggleClass('hidden');
};

// submit listener for adding stories
$addStoryForm.on('submit', handleAddStory);

// function that toggles the favorites
const toggleFavorites = async (e) => {
  const $target = $(e.target);
  const targetId = $target.parent().parent().attr('id');
  const targetStory = storyList.stories.find((story) => story.storyId === targetId);
  if ($target.hasClass('fas')) {
    await currentUser.removeFavorites(targetStory);
  } else {
    await currentUser.addFavorites(targetStory);
  }
  $target.toggleClass('fas far');

  if ($target.parent().parent().parent().attr('id') === 'fav-stories-list') putFavoritesOnPage();
};

// click handler for toggling favorites on stars
$allStoriesList.on('click', 'i', toggleFavorites);
$favoriteStoriesList.on('click', 'i', toggleFavorites);
