'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin');
  $('.main-nav-links').show();
  $navLogin.hide();
  $navLogOut.show();
  $navLeft.toggleClass('hidden');
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Toggle the submit story form
const toggleSubmitForm = () => {
  $addStoryForm.toggleClass('hidden');
};

$addStoryBtn.on('click', toggleSubmitForm);

// Toggle the show favorites
const putFavoritesOnPage = () => {
  hidePageComponents();
  $favoriteStoriesList.empty();
  if (currentUser.favorites.length === 0)
    $favoriteStoriesList.html('<h5>You dont have any favorites!</h5>');

  // loop through all the favorites and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }
  $favoriteStoriesList.show();
};

// Toggle the show own stories
// function that toggles own stories
const putOwnOnPage = async (e) => {
  hidePageComponents();
  $ownStoriesList.empty();
  if (currentUser.ownStories.length === 0)
    $ownStoriesList.html('<h5>You dont own any stories!</h5>');
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $ownStoriesList.append($story);
  }

  $ownStoriesList.show();
};

$showFavBtn.on('click', putFavoritesOnPage);

$showOwnBtn.on('click', putOwnOnPage);
