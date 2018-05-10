import Vuex from 'vuex';
import { expect } from 'chai';
import { simplePushers } from '../../lib';

describe('simplePushers', () => {
    it('basic state', () => {
        const store = new Vuex.Store({
            mutations: simplePushers({
                pushFoo: 'foo',
            }),
            state: {
                foo: [],
            },
        });

        store.commit('pushFoo', 'hello');
        expect(store.state.foo).to.deep.equal(['hello']);

        store.commit('pushFoo', 'world');
        expect(store.state.foo).to.deep.equal(['hello', 'world']);
    });

    it('nested state', () => {
        const store = new Vuex.Store({
            mutations: simplePushers({
                pushBaz: 'foo.bar.baz',
            }),
            state: {
                foo: {
                    bar: {
                        baz: [],
                    },
                },
            },
        });

        store.commit('pushBaz', 'hello');
        expect(store.state.foo.bar.baz).to.deep.equal(['hello']);
    })
});