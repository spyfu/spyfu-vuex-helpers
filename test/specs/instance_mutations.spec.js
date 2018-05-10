import { Store } from 'vuex'
import { expect } from 'chai';
import { instanceMutations } from '../../lib';

//
// factory
//
function createStore() {
    return new Store({
        state: {
            instances: [
                { id: 1, value: 'test1' },
                { foo: 3, value: 'test3' },
                { id: 5, value: 'test5' },
            ],
            otherInstances: [
                { id: 2, value: 'test2' },
                { foo: 4, value: 'test4' },
            ],
            test5: 'test5',
        },
        mutations: {
            // default api
            ...instanceMutations({
                test1(instance, payload) {
                    instance.value = payload.value;
                },
                test5(instance, payload, state) {
                    instance.value = payload.value;
                    state.test5 = payload.value;
                },
            }),

            // customized state key
            ...instanceMutations({ stateKey: 'otherInstances' }, {
                test2(instance, payload) {
                    instance.value = payload.value;
                },
            }),

            // customized instance key
            ...instanceMutations({ instanceKey: 'foo' }, {
                test3(instance, payload) {
                    instance.value = payload.value;
                },
            }),

            // customized state and instance keys
            ...instanceMutations({ stateKey: 'otherInstances', instanceKey: 'foo' }, {
                test4(instance, payload) {
                    instance.value = payload.value;
                },
            }),
        },
    });
}

//
// tests
//
describe('instanceMutations', () => {
    let store;

    beforeEach(() => {
        store = createStore();
    });

    it('can be used to mutation instances', () => {
        store.commit('test1', { id: 1, value: 'one' });

        expect(store.state.instances[0].value).to.equal('one');
    });

    it('can be configured with a different state key', () => {
        store.commit('test2', { id: 2, value: 'two' });

        expect(store.state.otherInstances[0].value).to.equal('two');
    });

    it('can be configured with a different instance key', () => {
        store.commit('test3', { foo: 3, value: 'three' });

        expect(store.state.instances[1].value).to.equal('three');
    });

    it('can be configured with different state and instance keys', () => {
        store.commit('test4', { foo: 4, value: 'four' });

        expect(store.state.otherInstances[1].value).to.equal('four');
    });

    it('mutations can modify state outside of individual instances', () => {
        store.commit('test5', { id: 5, value: 'five' });

        expect(store.state.instances[2].value).to.equal('five');
        expect(store.state.test5).to.equal('five');
    });
});
