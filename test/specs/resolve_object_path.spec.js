import { expect } from 'chai';
import { resolveObjectPath } from '../../lib';

describe('resolveObjectPath', () => {
    const obj = {
        foo: {
            bar: {
                baz: 'hello',
            },
        },
    };

    it('uses a dot as the default delimeter', () => {
        expect(resolveObjectPath(obj, 'foo.bar.baz')).to.equal('hello');
    });

    it('returns undefined when path is not found', () => {
        expect(resolveObjectPath(obj, 'one.two.three')).to.be.undefined;
    });

    it('accepts a string delimeter', () => {
        expect(resolveObjectPath(obj, 'foo/bar/baz', '/')).to.equal('hello');
    });

    it('accepts a regex delimeter', () => {
        expect(resolveObjectPath(obj, 'foo.bar/baz', /\.|\//)).to.equal('hello');
    });

    it('accepts an array as the path', () => {
        expect(resolveObjectPath(obj, ['foo', 'bar', 'baz'])).to.equal('hello');
    });
});
