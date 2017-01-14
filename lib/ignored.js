'use strict';

var fs = require('fs');
var path = require('path');
var constants = require('./constants');

var DEFAULT_IGNORED = [
  constants.SCRIBAL_IGNORE_FILE,
  constants.SCRIBAL_SUMMARY_FILE,
  constants.SCRIBAL_METADATA_FILE,
  constants.SCRIBAL_WOVEN_DIR,
  constants.SCRIBAL_MATERIALS_DIR,
  constants.GIT_REPO_PATH
];

function getIgnored(specPath, cb) {
  var file = path.join(specPath, constants.SCRIBAL_IGNORE_FILE);
  fs.stat(file, function(err) {
    if (err) {
      return cb(null, DEFAULT_IGNORED);
    } else {
      fs.readFile(file, constants.DEFAULT_FILE_ENCODING, function(ex, fileContents) {
        if (ex) {
          return cb(ex);
        } else {
          return cb(null, DEFAULT_IGNORED.concat(parse(fileContents)));
        }
      });
    }
  });
}

function getIgnoredSync(specPath) {
  var file = path.join(specPath, constants.SCRIBAL_IGNORE_FILE);
  try {
    fs.statSync(file);
    var fileContent = fs.readFileSync(file, constants.DEFAULT_FILE_ENCODING);
    return DEFAULT_IGNORED.concat(parse(fileContent));
  } catch (err) {
    return DEFAULT_IGNORED;
  }
}

function parse(fileContent) {
  return fileContent.split('\n').map(function(line) {
    return line.trim();
  }).filter(function(line) {
    return '' !== line && !line.startsWith('#');
  });
}

module.exports = {
  getIgnoredSync: getIgnoredSync,
  getIgnored: getIgnored
};
