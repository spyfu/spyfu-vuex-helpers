import { expect } from 'chai';
import { findInstanceThen } from '../../lib';
import Vuex from 'vuex';

//
// factory
//
function CreateStore() {
    return new Vuex.Store({
        mutations: {
            create(state, id) {
                state.instances.push({ id, value: null });
            },
            update: findInstanceThen((instance, payload) => {
                instance.value = payload.value;
            }),
        },
        state: {
            instances: [],
        },
    })
}

//
// tests
//
describe('findInstanceThen', () => {
    let store;

    beforeEach(() => {
        store = CreateStore();
        store.commit('create', 'test');
    });

    it('can be used to mutate an instance', () => {
        store.commit('update', { id: 'test', value: 'bar' });

        expect(store.state.instances[0].value).to.equal('bar');
    });

    it('does nothing if the instance was not found', () => {
        expect(() => store.commit('update', { id: 'foo', value: 'bar' })).not.to.throw;
        expect(store.state.instances[0].value).to.be.null
    });
});
