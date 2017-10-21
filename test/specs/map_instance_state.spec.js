import { expect } from 'chai';
import { mapInstanceState } from '../../lib';
import Vue from 'vue';
import Vuex from 'vuex';

//
// factory
//
const mount = function(vm) {
    const store = new Vuex.Store({
        state: {
            instances: [
                { id: 1, foo: 'bar' },
            ],
        },
        });

    return new Vue(Object.assign({
        el: document.createElement('div'),
        render: h => h('div'),
        store,
    }, vm));
}

//
// tests
//
describe.only('mapInstanceState', () => {

    // test 1
    it('array syntax', () => {
        const vm = mount({
            computed: {
                id: () => 1,
                ...mapInstanceState(['foo']),
            },
        });

        expect(vm.foo).to.equal('bar');
    });
});
