import { expect } from 'chai';
import { findInstanceThen } from '../../lib';
import sinon from 'sinon';
import Vuex from 'vuex';

//
// factory
//
function CreateStore(state = {}) {
    return new Vuex.Store({
        mutations: {
            create(state, id) {
                state.instances.push({ id, value: null });
            },
            update: findInstanceThen((instance, payload) => {
                instance.value = payload.value;
            }),
            stateTest: findInstanceThen((instance, payload, state) => {
                instance.value = state.stateTestValue;
            }),
        },
        state,
    })
}

//
// tests
//
describe('findInstanceThen', () => {
    let error;

    beforeEach(() => {
        error = sinon.stub(console, 'error');
    });

    afterEach(() => {
        error.restore();
    });

    it('can be used to mutate an instance', () => {
        const store = CreateStore({ instances: [] });

        store.commit('create', 'test');
        store.commit('update', { id: 'test', value: 'bar' });

        expect(store.state.instances[0].value).to.equal('bar');
    });

    it('exposes state as the third argument', () => {
        const store = CreateStore({ instances: [], stateTestValue: 'hello' });

        store.commit('create', 'test');
        store.commit('stateTest', { id: 'test' });

        expect(store.state.instances[0].value).to.equal('hello');
    });


    it('does nothing if the instance was not found', () => {
        const store = CreateStore({ instances: [] });

        store.commit('create', 'test');

        expect(() => store.commit('update', { id: 'foo', value: 'bar' })).not.to.throw;
        expect(store.state.instances[0].value).to.be.null
    });
    it('errors when the state does not contain an instances array', () => {
        const store = CreateStore();

        store.commit('update', { id: 'foo', value: 'bar' });

        expect(error.called).to.be.true;
    });

    it('errors when the payload is not an object', () => {
        const store = CreateStore({ instances: [] });

        store.commit('update', 'foo');

        expect(error.called).to.be.true;
    });

    it('errors when the payload does not contain an id', () => {
        const store = CreateStore({ instances: [] });

        store.commit('update', { value: 'foo' });

        expect(error.called).to.be.true;
    });
});
