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
                                { id: 6, value: 'test6' },
                                { id: 11, value: 'test11' },
                            ],
                        },
                    },
                },
                state: {
                    instances: [
                        { id: 2, value: 'test2' },
                        { id: 5, value: 'test5' },
                        { id: 9, value: 'test9' },
                    ],
                },
            },
        },
        state: {
            instances: [
                { id: 1, value: 'test1' },
                { id: 4, value: 'test4' },
                { id: 7, one: { two: 'test7' }},
                { id: 8, value: 'test8' },
                { id: 10, one: { two: 'test10' }},
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
describe('mapInstanceState', () => {

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

    // test 10
    it('array syntax, state path', () => {
        const vm = mount({
            computed: {
                id: () => 10,
                ...mapInstanceState(['one.two']),
            },
        });

        expect(vm.two).to.equal('test10');
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

    // test 5
    it('object syntax, namespaced', () => {
        const vm = mount({
            computed: {
                id: () => 5,
                ...mapInstanceState('namespaced', { foo: 'value' }),
            }
        });

        expect(vm.foo).to.equal('test5');
    });

    // test 6
    it('object syntax, nested namespace', () => {
        const vm = mount({
            computed: {
                id: () => 6,
                ...mapInstanceState('namespaced/foo', { foo: 'value' }),
            }
        });

        expect(vm.foo).to.equal('test6');
    });

    // test 7
    it('object syntax, state path', () => {
        const vm = mount({
            computed: {
                id: () => 7,
                ...mapInstanceState({ foo: 'one.two' }),
            }
        });

        expect(vm.foo).to.equal('test7');
    });

    // test 8
    it('alternate vm identifier', () => {
        const vm = mount({
            computed: {
                alternateId: () => 8,
                ...mapInstanceState(['value'], 'alternateId'),
            }
        });

        expect(vm.value).to.equal('test8');
    });

    // test 9
    it('alternate vm identifier, namespaced', () => {
        const vm = mount({
            computed: {
                alternateId: () => 9,
                ...mapInstanceState('namespaced', ['value'], 'alternateId'),
            },
        });

        expect(vm.value).to.equal('test9');
    });

    // 11
    it('alternate vm identifier, nested namespace', () => {
        const vm = mount({
            computed: {
                alternateId: () => 11,
                ...mapInstanceState('namespaced/foo', ['value'], 'alternateId'),
            },
        });

        expect(vm.value).to.equal('test11');
    })
});
