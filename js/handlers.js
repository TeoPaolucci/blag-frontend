'use strict';

$(document).ready(function() {
  $.ajaxSetup({
    xhrFields : {
      withCredentials : true
    }
  });

  location.hash = '#';

  // functions and vars
  var switchView = function switchView(view) {
    $('#main-page').hide();
    $('#view-all').hide();
    $('#view-one').hide();
    $('#create').hide();

    if(view === 'view-all') {
      console.log('switched to view all');
      $('#view-all').show();
    } else if (view === 'view-one') {
      console.log('switched to view one');
      $('#view-one').show();
    } else if (view === 'create') {
      console.log('switched to create');
      $('#create').show();
    } else {
      console.log('switched to view main');
      $('#main-page').show();
    }
  };

  var allPostTemplate = Handlebars.compile($('#template-view-all').html());
  var onePostTemplate = Handlebars.compile($('#template-view-one').html());

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
        api.getSinglePost(extension[2], function(err, data) {
          if(err) {
            console.error(err);
            return;
          }
          var html = onePostTemplate(data);
          $('#view-one').html(html);
        });
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
      case "login-submit":
        api.login(credentials, function(err, data) {
          if(err) {
            console.error(err);
            return;
          }
          $('#my-blag-nav').attr('href', '#user-posts');
          $('#new-post-nav').attr('href', '#create');
        });
      break;

      case "register-submit": api.register(credentials, callback); break;

      case "newPass-submit": api.changePass(credentials, callback); break;
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

  $("#register-submit, #login-submit").on('click', function(e) {
    e.target.parentNode.buttonUsed = e.target.id;
  });

  $("#new-post").on('submit', function(e) {
    e.preventDefault();
    var post = form2object(event.target);
    api.newPost(post, function(err, data) {
      if(err) {
        console.error(err);
        return;
      }
      switchView('view-one');
      var newPostID = data._id;
      api.getSinglePost(newPostID, function(err, data) {
        if(err) {
          console.error(err);
          return;
        }
        var html = onePostTemplate(data);
        $('#view-one').html(html);
      });
    });
  });
});
