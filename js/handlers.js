'use strict';

$(document).ready(function() {
  $.ajaxSetup({
    xhrFields : {
      withCredentials : true
    }
  });

  location.hash = '#';

  // functions and vars
  var locationHashChanged = function locationHashChanged() {
    // home page hash url (login/register/logout/password)
    if(location.hash === '#home') {
      switchView('main-page');
    }

    // all posts hash url
    else if (location.hash === '#posts') {
      switchView('view-all');
      api.getAllPosts(function(err, data) {
        if(err) {
          console.error(err);
          return;
        }
        var html = allPostTemplate(data);
        $('#view-all').html(html);
      });
    }

    // all logged in user posts
    else if (location.hash === '#user-posts') {
      switchView('view-all');
      api.getLoggedUserPosts(function(err, data) {
        if(err) {
          console.error(err);
          return;
        }
        var html = allPostTemplate(data);
        $('#view-all').html(html);
      });
    }

    // create post form hash url
    else if (location.hash === '#create') {
      switchView('create');
    }

    else if (location.hash === '#') {}

    // any other hash url, broken down by splitting the hash using '/'
    // ex. #/article/<some ID> --> [#, article, <some ID>]
    else {
      var extension = location.hash.split('/');
      if(extension[1] === 'article') {
        switchView('view-one');
        api.getSinglePost(extension[2], onePostCallback);
      }
    }
  };

  // Clickhandlers
  switchView('main-page');

  window.addEventListener('hashchange', locationHashChanged);

  $('#logreg-form').on('submit', function(e) {
    e.preventDefault();
    var credentials = form2object(event.target);
    var button = e.target.buttonUsed;
    switch(button) {
      case 'login-submit':
        api.login(credentials, function(err, data) {
          if(err) {
            console.error(err);
            return;
          }
          $('#my-blag-nav').attr('href', '#user-posts');
          $('#new-post-nav').attr('href', '#create');
        });
      break;

      case 'register-submit': api.register(credentials, callback); break;

      case 'newPass-submit': api.changePass(credentials, callback); break;
    }
  });

  $('#logout').on('click', function() {
    api.logout(function(err, data) {
      if(err) {
        console.error(err);
        return;
      }
    });
  });

  $('#register-submit, #login-submit').on('click', function(e) {
    e.target.parentNode.buttonUsed = e.target.id;
  });

  $('#new-post').on('submit', function(e) {
    e.preventDefault();
    var post = form2object(event.target);
    api.newPost(post, function(err, data) {
      if(err) {
        console.error(err);
        return;
      }
      switchView('view-one');
      var newPostID = data._id;
      api.getSinglePost(newPostID, onePostCallback);
    });
  });

  $('#update-submit').on('submit', function(e) {
    e.preventDefault();
    var post = form2object(event.target);
    var postID = $('#update-ID').val();
    api.updatePost(postID, post, function(err, data) {
      if(err) {
        console.error(err);
        return;
      }
      switchView('view-one');
      var newPostID = data._id;
      api.getSinglePost(newPostID, onePostCallback);
    });
  });

});
