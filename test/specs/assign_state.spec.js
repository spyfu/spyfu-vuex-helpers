import { Store } from 'vuex'
import { expect } from 'chai';
import { assignState } from '../../lib';

describe('assignState', () => {
    it('state reset', () => {
        const factoryFn = () => {
            return {
                foo: 1,
                bar: 2,
            }
        }

        const store = new Store({
            mutations: {
                reset: assignState(factoryFn),
                setBar: (state, bar) => state.bar = bar,
                setFoo: (state, foo) => state.foo = foo,
            },
            state: factoryFn,
        });

        store.commit('setFoo', 'foo');
        store.commit('setBar', 'bar');

        // quick sanity check to make sure our state is different
        expect(store.state.foo).to.equal('foo');
        expect(store.state.bar).to.equal('bar');
        
        // now we'll reset our state using the assignState helper
        store.commit('reset');

        // and our state should now have the original values
        expect(store.state.foo).to.equal(1);
        expect(store.state.bar).to.equal(2);
    });
});
