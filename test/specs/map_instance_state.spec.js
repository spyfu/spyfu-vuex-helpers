import { expect } from 'chai';
import { mapInstanceState } from '../../lib';
import Vue from 'vue';
import Vuex from 'vuex';

//
// factory
//
const mount = function(vm) {
    const store = new Vuex.Store({
        modules: {
            test2: {
                state: {
                    instances: [{ id: 2, foo: 'bar' }],
                },
            },
            test3: {
                modules: {
                    foo: {
                        state: {
                            instances: [{ id: 3, foo: 'bar' }],
                        }
                    }
                }
            }
        },
        state: {
            instances: [{ id: 1, foo: 'bar' }],
        },
    });

    return new Vue({
        el: document.createElement('div'),
        render: h => h('div'),
        store,
        ...vm,
    });
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

    // test 2
    it('array syntax, namespaced', () => {
        const vm = mount({
            computed: {
                id: () => 2,
                ...mapInstanceState('test2', ['foo']),
            },
        });

        expect(vm.foo).to.equal('bar');
    });

    it('array syntax, nested namespace', () => {
        const vm = mount({
            computed: {
                id: () => 3,
                ...mapInstanceState('test3/foo', ['foo']),
            },
        });

        expect(vm.foo).to.equal('bar');
    })
});
