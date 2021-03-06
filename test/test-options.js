/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, moz:true, indent:4, maxerr:50, globalstrict: true */
/*global require: false, exports: false */

/*
 * Copyright (C) 2014  Boucher, Antoni <bouanto@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const { get, has, reset, set } = require('sdk/preferences/service'),
    self = require('sdk/self'),
    simplePrefs = require('sdk/simple-prefs'),
    prefs = simplePrefs.prefs,
    { migrateObjectPreference, migratePreference, setPreferenceMaximum, setPreferenceMinimum } = require('options'),
    { getOptionName } = require('./utils');

/**
 * Set the value of the `name`d preference.
 * @param {string} name The preference name.
 * @return {boolean|string|int} The preference value.
 */
function getOption(name) {
    return get(getOptionName(name));
}

/**
 * Set the `value` of the `name`d preference.
 * @param {string} name The preference name.
 * @param {boolean|string|int} value The preference value.
 */
function setOption(name, value) {
    set(getOptionName(name), value);
}

/**
 * Test the migrateObjectPreference() function.
 */
exports.testMigrateObjectPreference = function(assert) {
    set('extensions.oldextension.arrayName', JSON.stringify(['1', '2', '3']));
    migrateObjectPreference('extensions.oldextension.arrayName', ['newName1', 'newName2', 'newName3'], ['4', '6', '5']);
    
    assert.strictEqual(prefs.newName1, 1);
    assert.strictEqual(prefs.newName2, 2);
    assert.strictEqual(prefs.newName3, 3);
    
    assert.strictEqual(has('extensions.oldextension.arrayName'), true);
    
    set('extensions.oldextension.objectName', JSON.stringify({
        name1: '1',
        name2: '2',
        name3: '3'
    }));
    migrateObjectPreference('extensions.oldextension.objectName', {'name1': 'newObject1', 'name2': 'newObject2', 'name3': 'newObject3'}, {'name1': 'newObject6', 'name2': 'newObject4', 'name3': 'newObject5'});
    
    assert.strictEqual(prefs.newObject1, 1);
    assert.strictEqual(prefs.newObject2, 2);
    assert.strictEqual(prefs.newObject3, 3);
    
    assert.strictEqual(has('extensions.oldextension.objectName'), true);
    
    reset('extensions.oldextension.arrayName');
    
    migrateObjectPreference('extensions.oldextension.arrayName', ['newName1', 'newName2', 'newName3'], ['4', '6', '5']);
    
    assert.strictEqual(prefs.newName1, 4);
    assert.strictEqual(prefs.newName2, 6);
    assert.strictEqual(prefs.newName3, 5);
    
    reset('extensions.oldextension.objectName');
    
    migrateObjectPreference('extensions.oldextension.objectName', {'name1': 'newObject1', 'name2': 'newObject2', 'name3': 'newObject3'}, {name1: '6', name2: '4', name3: '5'});
    
    assert.strictEqual(prefs.newObject1, 6);
    assert.strictEqual(prefs.newObject2, 4);
    assert.strictEqual(prefs.newObject3, 5);
    
    reset(getOptionName('newName1'));
    reset(getOptionName('newName2'));
    reset(getOptionName('newName3'));
    
    reset(getOptionName('newObject1'));
    reset(getOptionName('newObject2'));
    reset(getOptionName('newObject3'));
};

/**
 * Test the migratePreference() function.
 */
exports.testMigratePreference = function(assert) {
    set('extensions.oldextension.name', 'Value');
    migratePreference('extensions.oldextension.name', 'newName', 'Default Value');
    
    assert.strictEqual(prefs.newName, 'Value');
    
    assert.strictEqual(has('extensions.oldextension.name'), true);
    
    reset('extensions.oldextension.name');
    
    migratePreference('extensions.oldextension.name', 'newName', 'Default Value');
    
    assert.strictEqual(prefs.newName, 'Default Value');
    
    assert.strictEqual(has('extensions.oldextension.name'), false);
    
    reset(getOptionName('newName'));
    reset('extensions.oldextension.name');
};

/**
 * Test the setPreferenceMaximum() function.
 */
exports.testPreferenceMaximum = function(assert) {
    setPreferenceMaximum('testMax', 15);
    
    setOption('testMax', 5);
    assert.strictEqual(getOption('testMax'), 5);
    
    setOption('testMax', 15);
    assert.strictEqual(getOption('testMax'), 15);
    
    setOption('testMax', 10);
    assert.strictEqual(getOption('testMax'), 10);
    
    setOption('testMax', 20);
    assert.strictEqual(getOption('testMax'), 15);
    
    setOption('testMax', 0);
    assert.strictEqual(getOption('testMax'), 0);
    
    setOption('testMax', 16);
    assert.strictEqual(getOption('testMax'), 15);
    
    setOption('testMax', -30);
    assert.strictEqual(getOption('testMax'), -30);
    
    setOption('testMax', 17);
    assert.strictEqual(getOption('testMax'), 15);
    
    reset(getOptionName('testMax'));
};

/**
 * Test the setPreferenceMaximum() and setPreferenceMinimum() functions on the same option.
 */
exports.testPreferenceMaximumMinimum = function(assert) {
    setPreferenceMaximum('testMaxMin', 15);
    setPreferenceMinimum('testMaxMin', 2);
    
    setOption('testMaxMin', 5);
    assert.strictEqual(getOption('testMaxMin'), 5);
    
    setOption('testMaxMin', 15);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', 10);
    assert.strictEqual(getOption('testMaxMin'), 10);
    
    setOption('testMaxMin', 20);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', 0);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    setOption('testMaxMin', 16);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', -30);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    setOption('testMaxMin', 17);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', 2);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    setOption('testMaxMin', 22);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', 1);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    setOption('testMaxMin', 30);
    assert.strictEqual(getOption('testMaxMin'), 15);
    
    setOption('testMaxMin', -2);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    setOption('testMaxMin', -1);
    assert.strictEqual(getOption('testMaxMin'), 2);
    
    reset(getOptionName('testMaxMin'));
};

/**
 * Test the setPreferenceMinimum() function.
 */
exports.testPreferenceMinimum = function(assert) {
    setPreferenceMinimum('testMin', 2);
    
    setOption('testMin', 5);
    assert.strictEqual(getOption('testMin'), 5);
    
    setOption('testMin', 2);
    assert.strictEqual(getOption('testMin'), 2);
    
    setOption('testMin', 10);
    assert.strictEqual(getOption('testMin'), 10);
    
    setOption('testMin', 0);
    assert.strictEqual(getOption('testMin'), 2);
    
    setOption('testMin', 22);
    assert.strictEqual(getOption('testMin'), 22);
    
    setOption('testMin', 1);
    assert.strictEqual(getOption('testMin'), 2);
    
    setOption('testMin', 30);
    assert.strictEqual(getOption('testMin'), 30);
    
    setOption('testMin', -2);
    assert.strictEqual(getOption('testMin'), 2);
    
    reset(getOptionName('testMin'));
};

require('sdk/test').run(exports);
