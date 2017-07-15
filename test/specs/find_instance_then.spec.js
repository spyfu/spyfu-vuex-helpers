import { expect } from 'chai';
import { findInstanceThen } from '../../lib';
import sinon from 'sinon';
import Vuex from 'vuex';

// customized version of the helper
const configuredFindInstanceThen = findInstanceThen.config({
    stateKey: 'foo',
    instanceKey: 'bar',
});

//
// factory
//
function CreateStore(state = {}) {
    return new Vuex.Store({
        mutations: {
            create(state, id) {
                state.instances.push({ id, value: null });
            },
            createFoo(state, bar) {
                state.foo.push({ bar, value: null });
            },
            createFooWithId(state, id) {
                state.foo.push({ id, value: null });
            },
            update: findInstanceThen((instance, payload) => {
                instance.value = payload.value;
            }),
            stateTest: findInstanceThen((instance, payload, state) => {
                instance.value = state.stateTestValue;
            }),
            configTest: findInstanceThen({ stateKey: 'foo', instanceKey: 'bar' }, (instance, payload) =>{
                instance.value = payload.value;
            }),
            configTest2: configuredFindInstanceThen((instance, payload) => {
                instance.value = payload.value;
            }),
            configTest3: findInstanceThen({ stateKey: 'foo' }, (instance, payload) => {
                instance.value = payload.value;
            }),
        },
        state,
    });
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

    it('accepts a config object as the first argument', () => {
        const store = CreateStore({ foo: [] });

        store.commit('createFoo', 'test');
        store.commit('configTest', { bar: 'test', value: 'aloha' });

        expect(store.state.foo[0].value).to.equal('aloha');
    });

    it('exposes a helper to partially apply configuration', () => {
        const store = CreateStore({ foo: [] });

        store.commit('createFoo', 'test');
        store.commit('configTest2', { bar: 'test', value: 'hello' });

        expect(store.state.foo[0].value).to.equal('hello');
    });

    // https://github.com/spyfu/spyfu-vuex-helpers/issues/3
    it('merges custom config with default values', () => {
        const store = CreateStore({ foo: [] });

        store.commit('createFooWithId', 'test');
        store.commit('configTest3', { id: 'test', value: 'hello' });

        expect(store.state.foo[0].value).to.equal('hello');
    });
});
