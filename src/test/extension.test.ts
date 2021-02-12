import * as assert from 'assert';
const dedent = require("dedent");

import { PATTERN } from '../documentSymbolProvider';

const match = (str: String) => dedent(str).match(PATTERN);

suite("Pattern Tests", function () {

    test("Not match", function() {
        assert.deepEqual(match(`
        print 1;
        `), null);
    });

    test("sub", function() {
        assert.deepEqual(match(`
        sub foo {}
        sub bar {}
        `), ['sub foo', 'sub bar']);
    });

    test("package", function() {
        assert.deepEqual(match(`
        package Foo;
        `), ['package Foo']);
    });

    test("package must start from beginning of lines", function() {
        assert.deepEqual(match(`
        # package Foo;
        `), null);
    });

    test("# sub is not a sub", function() {
        assert.deepEqual(match(`
        # sub like
        `), null);
    });
});