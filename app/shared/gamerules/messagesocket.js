var _ = require('underscore')._;

module.exports = MessageSocket;

function MessageSocket(uri) {
  _(this).bindAll();

  this.pending = {};
  this.ws = new WebSocket(uri);
  this.ws.onopen = this.onopen;
  this.ws.onmessage = this.onmessage;
  this.ws.onerror = this.onerror;
  this.ws.onclose = this.onclose;

  var noop = function() {};
  this._handlers = {
    'open': noop,
    'message': noop,
    'error': noop,
    'close': noop
  };
}

MessageSocket.prototype = {

  on: function(event, handler) {
    this._handlers[event] = handler;
  },

  enqueue: function(id, callback) {
    this.pending[id] = callback;
  },

  send_message: function(type, name, parameters, callback) {
    var id = Math.floor(Math.random() * 9999999);
    var data = JSON.stringify({
      id: id,
      type: type,
      name: name,
      parameters: parameters
    });
    this.enqueue(data.id, callback);
    this.ws.send(data);
  },

  request: function(name, parameters, callback) {
    return this.send_message('request', name, parameters, callback);
  },

  event: function(name, parameters, callback) {
    return this.send_message('event', name, parameters, callback);
  },

  onopen: function() {
    this._handlers.open();
  },

  onmessage: function(event) {
    var message = JSON.parse(event.data);
    if (message.id && this.pending[message.id]) {
      var callback = this.pending[message.id];
      callback(undefined, message);
    }
    this._handlers.message(event.data);
  },

  onerror: function(err) {
    this._handlers.error(err);
  },

  onclose: function() {
    this._handlers.close();
  }
};