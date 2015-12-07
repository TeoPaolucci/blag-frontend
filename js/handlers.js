'use strict';

$(document).ready(function() {
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
    if(location.hash === '#home') {
      switchView('main-page');
    } else if (location.hash === '#posts') {
      switchView('view-all');
      api.getAllPosts(callback);
      var html = allPostTemplate(serverData);
      $('#view-all').html(html);
    } else if (location.hash === '#create') {
      switchView('create');
    } else {
      var extension = location.hash.split('/');
      if(extension[1] === 'article') {
        switchView('view-one');
        api.getSinglePost(extension[2], callback);
        var html = onePostTemplate(serverData);
        $('#view-one').html(html);
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
      case "login-submit": api.login(credentials, callback); break;
      case "register-submit": api.register(credentials, callback); break;
      case "newPass-submit": api.changePass(credentials, callback); break;
      case "logout": api.logout(callback); break;
    }
  });

  $("#register-submit, #login-submit").on('click', function(e) {
    e.target.parentNode.buttonUsed = e.target.id;
  });

  $("#new-post").on('submit', function(e) {
    e.preventDefault();
    var post = form2object(event.target);
    api.newPost(post, callback);
    switchView('show-one');
  })
});
