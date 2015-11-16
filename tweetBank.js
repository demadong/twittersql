// lodash, like underscore, is a utility library
var _ = require('lodash');
var data = [];

// function add(name, text) {

// };

// function list() {

// };

// function find(properties) {

// };

// function add (name, text) {
//   data.push({ name: name, text: text, id: (data.length).toString() });
// };

// function list () {
//   return _.cloneDeep(data);
// };

// function find (properties) {
//   return _.where(data, properties);
// };

module.exports = {
  add: add,
  list: list,
  find: find
};