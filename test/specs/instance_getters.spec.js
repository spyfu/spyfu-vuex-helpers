import { expect } from 'chai';
import { instanceGetters } from '../../lib';
import Vuex from 'vuex';

//
// factory
//
function createStore() {
    return new Vuex.Store({
        getters: {
            // default state and instance idenfitier keys
            ...instanceGetters({
                test1: instance => instance.value.toUpperCase(),
                test2: instance => true,
            }),

            // customized state key
            ...instanceGetters({ stateKey: 'otherInstances' }, {
                test3: instance => instance.value.toUpperCase(),
            }),

            // customized instance identifier key
            ...instanceGetters({ instanceKey: 'otherId' }, {
                test4: instance => instance.value.toUpperCase(),
            }),

            // customized state and instance identifier keys
            ...instanceGetters({ stateKey: 'otherInstances', instanceKey: 'otherId' }, {
                test5: instance => instance.value.toUpperCase(),
            }),
        },
        state: {
            instances: [
                { id: 1, value: 'one' },
                { otherId: 4, value: 'four' },
            ],
            otherInstances: [
                { id: 3, value: 'three' },
                { otherId: 5, value: 'five' },
            ],
        },
    });
}

//
// tests
//
describe('instanceGetters', () => {
    let store;

    beforeEach(() => {
        store = createStore();
    });

    it('returns computed state from an instance', () => {
        expect(store.getters.test1(1)).to.equal('ONE');
    });

    it('returns undefined if the instance is not found', () => {
        expect(store.getters.test2(-1)).to.be.undefined;
    });

    it('can be configured with a different state key', () => {
        expect(store.getters.test3(3)).to.equal('THREE');
    });

    it('can be configured with a different instance key', () => {
        expect(store.getters.test4(4)).to.equal('FOUR');
    });

    it('can be configured with different state and instance keys', () => {
        expect(store.getters.test5(5)).to.equal('FIVE');
    });
});
