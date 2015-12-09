var api = {
  backend: 'http://localhost:3000',

  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.backend + '/signup',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.backend + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  logout: function logout(callback) {
    this.ajax({
      method: 'GET',
      url: this.backend + '/logout',
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  changePass: function changePass(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.backend + '/changePassword',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  getAllPosts: function getAllPosts(callback) {
    this.ajax({
      method: 'GET',
      url: this.backend + '/posts',
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  getLoggedUserPosts: function getLoggedUserPosts(callback) {
    this.ajax({
      method: 'GET',
      url: this.backend + '/posts/user',
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  getUserPosts: function getUserPosts(id, callback) {
    this.ajax({
      method: 'GET',
      url: this.backend + '/posts/user/' + id,
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  getSinglePost: function getSinglePost(id, callback) {
    this.ajax({
      method: 'GET',
      url: this.backend + '/posts/article/' + id,
      contentType: 'application/json; charset=utf-8'
    }, callback);
  },

  newPost: function newPost(content, callback) {
    this.ajax({
      method: 'POST',
      url: this.backend + '/posts/user',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(content),
      dataType: 'json'
    }, callback);
  },

  deletePost: function deletePost(id, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.backend + '/posts/article/' + id
    }, callback);
  },

  updatePost: function updatePost(id, content, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.backend + '/posts/article/' + id,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(content),
      dataType: 'json'
    }, callback);
  }
};

var switchView = function switchView(view) {
  $('#main-page').hide();
  $('#view-all').hide();
  $('#view-one').hide();
  $('#create').hide();
  $('#update-view').hide();

  if(view === 'view-all') {
    console.log('switched to view all');
    $('#view-all').show();
  } else if (view === 'view-one') {
    console.log('switched to view one');
    $('#view-one').show();
  } else if (view === 'create') {
    console.log('switched to create');
    $('#create').show();
  } else if (view === 'update-view') {
    $('#update-view').show();
  } else {
    console.log('switched to view main');
    $('#main-page').show();
  }
};

var form2object = function(form) {
  var data = {};
  $(form).children().each(function(index, element) {
    var type = $(this).attr('type');
    if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
      data[$(this).attr('name')] = $(this).val();
    }
  });
  console.log("Form output:");
  console.log(data);
  return data;
};

var allPostTemplate = Handlebars.compile($('#template-view-all').html());
var onePostTemplate = Handlebars.compile($('#template-view-one').html());

var serverData;
var callback = function callback(error, data) {
  if (error) {
    console.error(error);
    return;
  }
  serverData = data;
  console.log(serverData);
};

var onePostCallback = function onePostCallback(error, data) {
  if(error) {
    console.error(err);
    return;
  }
  var html = onePostTemplate(data);
  $('#view-one').html(html);

  $('#delete').on('click', function() {
    api.deletePost(data._id, callback);
    switchView('view-all');
    api.getUserPosts(data.userID, function(err, data) {
      if(err) {
        console.error(err);
        return;
      }
      var html = allPostTemplate(data);
      $('#view-all').html(html);
    });

  });

  $('#update').on('click', function() {
    var oldTitle = data.title;
    var oldBody = data.body;
    var oldID = data._id;
    $('#update-title').val(oldTitle);
    $('#update-body').val(oldBody);
    $('#update-ID').val(oldID);
    $('#update-view').show();
  });
};

Handlebars.registerHelper('xbbcodeParse', function(input) {
  var result = XBBCODE.process({
      text: input,
      removeMisalignedTags: false,
      addInLineBreaks: true
  });
  console.log("Errors: " + result.error);
  console.dir(result.errorQueue);
  return result.html;
});
