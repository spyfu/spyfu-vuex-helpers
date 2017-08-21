import Vuex from 'vuex';
import { expect } from 'chai';
import { simpleSetters } from '../../lib';

describe('simpleSetters', () => {
    it('basic state', () => {
        const store = new Vuex.Store({
            mutations: simpleSetters({
                setFoo: 'foo',
            }),
            state: {
                foo: '',
            },
        });

        store.commit('setFoo', 'foo');
        expect(store.state.foo).to.equal('foo');
    });

    it('nested state', () => {
        const store = new Vuex.Store({
            mutations: simpleSetters({
                setBaz: 'foo.bar.baz',
            }),
            state: {
                foo: {
                    bar: {
                        baz: '',
                    },
                },
            },
        });

        store.commit('setBaz', 'baz');
        expect(store.state.foo.bar.baz).to.equal('baz');
    });
});
