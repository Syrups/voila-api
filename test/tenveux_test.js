/*global describe,it*/
'use strict';
var assert = require('assert'),
  tenveux = require('../lib/tenveux.js');

describe('tenveux node module.', function() {
  it('must be awesome', function() {
    assert( tenveux.awesome(), 'awesome');
  });
});
