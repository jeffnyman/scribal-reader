'use strict';

var chai = require('chai');
var expect = chai.expect;

var path = require('path');
var minimatch = require('minimatch');
var walker = require('../../lib/walker');

describe('path walking', function() {
  var TEST_PATH = 'test/resources/stories';
  var ALL_FILES_EXCEPT_RUBY = function (dir, file) {
    return !minimatch(path.join(dir, file), '**/*.rb');
  };

  describe('synchronously', function() {
    it('returns a path structure', function() {
      var structure = walker.walkPathSync(TEST_PATH, ALL_FILES_EXCEPT_RUBY);
      expectStructure(structure);
    });
  });

  describe('asynchronously', function() {
    it('returns a path structure', function(done) {
      walker.walkPath(TEST_PATH, ALL_FILES_EXCEPT_RUBY, function(err, structure) {
        expect(err).to.be.null;
        expectStructure(structure);
        done();
      });
    });
  });

  function expectStructure(structure) {
    expect(structure).to.deep.equal({
      "displayName": "Stories",
      "name": "stories",
      "path": ".",
      "type": "directory",
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "displayName": "Test-file-02",
                  "name": "test-file-02.feature",
                  "path": "path01/path02/test-file-02.feature",
                  "type": "file"
                }
              ],
              "displayName": "Path02",
              "name": "path02",
              "path": "path01/path02",
              "type": "directory"
            },
            {
              "displayName": "Test-file-01",
              "name": "test-file-01.feature",
              "path": "path01/test-file-01.feature",
              "type": "file"
            }
          ],
          "displayName": "Path01",
          "name": "path01",
          "path": "path01",
          "type": "directory",
        }
      ]
    });
  }
});
