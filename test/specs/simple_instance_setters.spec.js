import Vuex from 'vuex';
import sinon from 'sinon';
import { expect } from 'chai';
import { simpleInstanceSetters } from '../../lib';

describe('simpleInstanceSetters', () => {
    it('uses "instances" and "id" as the default identifiers', () => {
        const store = new Vuex.Store({
            mutations: simpleInstanceSetters({
                setFoo: 'foo',
            }),
            state: {
                instances: [
                    { id: 1, foo: '' },
                    { id: 2, foo: 'bar' },
                ],
            },
        });

        store.commit('setFoo', { id: 1, value: 'hello' });

        expect(store.state.instances[0].foo).to.equal('hello');
        expect(store.state.instances[1].foo).to.equal('bar');
    });

    it('accepts a custom instanceKey and identifierKey', () => {
        const store = new Vuex.Store({
            mutations: simpleInstanceSetters({
                setFoo: 'foo',
            }, 'customInstances', 'customId'),
            state: {
                customInstances: [
                    { customId: 1, foo: '' },
                    { customId: 2, foo: 'bar' },
                ],
            },
        });

        store.commit('setFoo', { customId: 1, value: 'hello' });

        expect(store.state.customInstances[0].foo).to.equal('hello');
        expect(store.state.customInstances[1].foo).to.equal('bar');
    });

    it('can set nested state', () => {
        const store = new Vuex.Store({
            mutations: simpleInstanceSetters({
                setFoo: 'foo.bar',
            }),
            state: {
                instances: [
                    { id: 1, foo: { bar: '' } },
                    { id: 2, foo: { bar: 'baz' } },
                ],
            },
        });

        store.commit('setFoo', { id: 1, value: 'hello' });

        expect(store.state.instances[0].foo.bar).to.equal('hello');
        expect(store.state.instances[1].foo.bar).to.equal('baz');
    });

    it('logs a warning when the instance is not found', () => {
        const warn = sinon.stub(console, 'warn');

        const store = new Vuex.Store({
            mutations: simpleInstanceSetters({
                setFoo: 'foo',
            }),
            state: {
                instances: [],
            },
        });

        store.commit('setFoo', { id: 1, value: 'hello' });

        expect(warn.called).to.be.true;

        warn.restore();
    });

    it('throws an error when the payload is invalid', () => {
        const store = new Vuex.Store({
            mutations: simpleInstanceSetters({
                setFoo: 'foo',
            }),
            state: {
                instances: [{ id: 1, foo: '' }],
            },
        });

        expect(() => store.commit('setFoo', { id: 1 })).to.throw;
    });
});
