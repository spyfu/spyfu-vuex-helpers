import { expect } from 'chai';
import { mapInstanceGetters } from '../../lib';
import Vue from 'vue';
import Vuex from 'vuex';

//
// factory
//
function CreateComponent(options = {}) {
    const store = new Vuex.Store({
        modules: {
            foo: {
                namespaced: true,
                state: {
                    instances: [ 0, 1, 2, 3, 4, 5 ],
                },
                getters: {
                    instance: (state) => (id) => state.instances[id],
                    shouldFail: (state) => state.child.five,
                    baz: (state) => () => state.three,
                }
            },
        },
        state: {
            one: 1,
            child: {
                four: 4,
            },
        },
        strict: true,
    });

    return new Vue(Object.assign({
        el: document.createElement('div'),
        render: h => h('div'),
        store,
    }, options));
}

//
// tests
//
describe('mapInstanceGetters', () => {
    it('returns actual value from getter', () => {
        const vm = CreateComponent({
            data() {
                return { id: 2 };
            },

            computed: mapInstanceGetters('foo', ['instance'])
        });

        expect(vm.instance).to.equal(2);
    });

    it('should fail if getter doesn\'t return a function', () => {
        expect(() => {
            CreateComponent({
                data() {
                    return { id: 2 };
                },

                computed: mapInstanceGetters('foo', ['shouldFail'])
            });
        }).to.throw;
    });
});
