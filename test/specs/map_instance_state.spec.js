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
            namespaced: {
                modules: {
                    foo: {
                        state: {
                            instances: [
                                { id: 3, value: 'test3' },
                                { id: 5, value: 'test5' },
                            ],
                        },
                    },
                },
                state: {
                    instances: [
                        { id: 2, value: 'test2' },
                        { id: 4, value: 'test4' },
                    ],
                },
            },
        },
        state: {
            instances: [
                { id: 1, value: 'test1' },
                { id: 4, value: 'test4' },
            ],
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
                ...mapInstanceState(['value']),
            },
        });

        expect(vm.value).to.equal('test1');
    });

    // test 2
    it('array syntax, namespaced', () => {
        const vm = mount({
            computed: {
                id: () => 2,
                ...mapInstanceState('namespaced', ['value']),
            },
        });

        expect(vm.value).to.equal('test2');
    });

    // test 3
    it('array syntax, nested namespace', () => {
        const vm = mount({
            computed: {
                id: () => 3,
                ...mapInstanceState('namespaced/foo', ['value']),
            },
        });

        expect(vm.value).to.equal('test3');
    });

    // test 4
    it('object syntax', () => {
        const vm = mount({
            computed: {
                id: () => 4,
                ...mapInstanceState({ foo: 'value' }),
            }
        });

        expect(vm.foo).to.equal('test4');
    });

    // test 4
    it('object syntax, namespaced', () => {
        const vm = mount({
            computed: {
                id: () => 4,
                ...mapInstanceState('namespaced', { foo: 'value' }),
            }
        });

        expect(vm.foo).to.equal('test4');
    });

    // test 5
    it('object syntax, nested namespace', () => {
        const vm = mount({
            computed: {
                id: () => 5,
                ...mapInstanceState('namespaced/foo', { foo: 'value' }),
            }
        });

        expect(vm.foo).to.equal('test5');
    });
});
