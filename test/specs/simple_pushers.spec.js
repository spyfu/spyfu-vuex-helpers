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
    });

    it('throws an error when target is not found', () => {
        let caught = false;

        try {
            const store = new Vuex.Store({
                mutations: simplePushers({
                    pushFoo: 'bar',
                }),
                state: {},
            });

            store.commit('pushFoo', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }
        
        expect(caught).to.be.true;
    });

    it('throws an error when target is not an array', () => {
        let caught = false;

        try {
            const store = new Vuex.Store({
                mutations: simplePushers({
                    pushFoo: 'bar',
                }),
                state: {
                    bar: 'not an array',
                },
            });

            store.commit('pushFoo', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }

        expect(caught).to.be.true;
    });

    it('throws an error when a nested path parent is not found', () => {
        let caught = false;

        try {
            const store = new Vuex.Store({
                mutations: simplePushers({
                    pushBaz: 'non.existant.whatever',
                }),
                state: {},
            });

            store.commit('pushBaz', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }

        expect(caught).to.be.true;
    });

    it('throws an error when a nested path is not found', () => {
        let caught = false;

        try {
            const store = new Vuex.Store({
                mutations: simplePushers({
                    pushBaz: 'foo.bar',
                }),
                state: {
                    foo: {},
                },
            });

            store.commit('pushBaz', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }

        expect(caught).to.be.true;
    });

    it('throws an error if the nested path is not an array', () => {
        let caught = false;

        try {
            const store = new Vuex.Store({
                mutations: simplePushers({
                    pushBaz: 'foo.bar',
                }),
                state: {
                    foo: {
                        bar: 'not an array',
                    },
                },
            });

            store.commit('pushBaz', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }

        expect(caught).to.be.true;
    })
});