'use strict';

var fs = require('fs');
var path = require('path');
var constants = require('./constants');

function walkPathSync(start, filter) {
  function search(file) {
    var node = {
      path: path.normalize(path.relative(start, file)).replace(/\\/g, '/'),
      name: path.basename(file)
    };

    node.displayName = getDisplayName(node.name);

    var stats = fs.statSync(file);

    if (stats.isDirectory()) {
      node.type = constants.WALKER_NODE_DIRECTORY;
      node.children = [];
      var files = readDirectorySync(file, filter);

      files.forEach(function(f) {
        node.children.push(search(path.join(file, f)));
      });
    };

    if (stats.isFile()) {
      node.type = constants.WALKER_NODE_FILE;
    };

    return node;
  }

  return search(start);
}

function walkPath(start, filter, cb) {
  global = {};
  var asyncOps = 0;
  var problemFound = false;

  function problem(err) {
    if (!problemFound) {
      return cb(err);
    };
    problemFound = true;
  }

  function search(parent, file) {
    parent.path = path.normalize(path.relative(start, file)).replace(/\\/g, '/');
    parent.name = path.basename(file);
    parent.displayName = getDisplayName(parent.name);

    asyncOps++;

    fs.stat(file, function(err, stat) {
      if (err) {
        problem(err);
      };

      if (stat.isDirectory()) {
        parent.type = constants.WALKER_NODE_DIRECTORY;
        asyncOps++;

        readDirectory(file, filter, function(err, files) {
          if (err) problem(err);

          parent.children = [];

          files.forEach(function(f) {
            var node = {};
            parent.children.push(node);
            search(node, path.join(file, f));
          });
          asyncOps--;
          if (asyncOps === 0) {
            return cb(null, global);
          };
        });
      };

      if (stat.isFile()) {
        parent.type = constants.WALKER_NODE_FILE;
      };

      asyncOps--;

      if (asyncOps === 0) {
        return cb(null, global);
      };
    });
  }

  search(global, start);
}

function getDisplayName(fileName) {
  var withoutUnderscores = fileName.replace(/_/g, ' ');
  var uppercase = withoutUnderscores.charAt(0).toUpperCase() + withoutUnderscores.slice(1);
  return uppercase.replace(/\.feature/g, '');
}

function readDirectorySync(dir, filter) {
  return filterFiles(dir, fs.readdirSync(dir), filter);
}

function readDirectory(dir, filter, cb) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      return cb(err);
    };
    cb(null, filterFiles(dir, files, filter));
  });
}

function filterFiles(dir, files, filter) {
  var filteredFiles = [];
  files.forEach(function(f) {
    if (filter(dir, f)) {
      filteredFiles.push(f);
    }
  });
  return filteredFiles;
}

module.exports = {
  walkPathSync: walkPathSync,
  walkPath: walkPath
};
