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
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
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
      url: this.backend + '/posts',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(content),
      dataType: 'json'
    }, callback);
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

var serverData = {};
var callback = function callback(error, data) {
  if (error) {
    console.error(error);
    return;
  }
  serverData = data;
  console.log(serverData);
};
