import { Store } from 'vuex'
import { expect } from 'chai';
import { simpleRemovers } from '../../lib';

describe('simpleRemovers', () => {
    it('basic state', () => {
        const store = new Store({
            mutations: simpleRemovers({
                removeFoo: 'foo',
            }),
            state: {
                foo: [1, 2, 3],
            },
        });

        store.commit('removeFoo', 2);
        expect(store.state.foo).to.deep.equal([1, 3]);
    });

    it('nested state', () => {
        const store = new Store({
            mutations: simpleRemovers({
                removeFoo: 'foo.bar',
            }),
            state: {
                foo: {
                    bar: [1, 2, 3],
                },
            },
        });

        store.commit('removeFoo', 2);
        expect(store.state.foo.bar).to.deep.equal([1, 3]);
    });
    
    it('throws an error when target is not found', () => {
        let caught = false;

        try {
            const store = new Store({
                mutations: simpleRemovers({
                    removeFoo: 'foo',
                }),
                state: {},
            });

            store.commit('removeFoo', 'whatever');
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
            const store = new Store({
                mutations: simpleRemovers({
                    removeFoo: 'foo',
                }),
                state: {
                    foo: 'not an array',
                },
            });

            store.commit('removeFoo', 'whatever');
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
            const store = new Store({
                mutations: simpleRemovers({
                    removeFoo: 'non.existant.whatever',
                }),
                state: {},
            });

            store.commit('removeFoo', 'whatever');
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
            const store = new Store({
                mutations: simpleRemovers({
                    removeBar: 'foo.bar',
                }),
                state: {
                    foo: {},
                },
            });

            store.commit('removeBar', 'whatever');
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
            const store = new Store({
                mutations: simpleRemovers({
                    removerBar: 'foo.bar',
                }),
                state: {
                    foo: {
                        bar: 'not an array',
                    },
                },
            });

            store.commit('removerBar', 'whatever');
        } catch (e) {
            caught = true;

            if (e.message.startsWith('[spyfu-vuex-helpers]') === false) {
                throw e;
            }
        }

        expect(caught).to.be.true;
    });
});