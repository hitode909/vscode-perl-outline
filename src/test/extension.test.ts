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

    test("capture indent string for location adjusting", function() {
        const matched = PATTERN.exec(dedent(`
        print 1;

          package Bar;
        `));
        assert(matched);
        if (matched) {
            assert.equal(matched[1], '\n  ');
            assert.equal(matched[2], 'package');
            assert.equal(matched[3], 'Bar');
        }
    });


    test("# sub is not a sub", function() {
        assert.deepEqual(match(`
        # sub like
        `), null);
    });

    test("prototypes", function() {
        assert.deepEqual(match(`
        sub method1 ($arg1, $arg2)
        sub method2($arg1, $arg2)
        sub method3($arg1,$arg2)
        `), ['sub method1 ($arg1, $arg2)', 'sub method2($arg1, $arg2)', 'sub method3($arg1,$arg2)']);
    });
});