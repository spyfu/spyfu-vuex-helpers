import { expect } from 'chai';
import { mapTwoWayState } from '../../';
import sinon from 'sinon';
import Vue from 'vue';
import Vuex from 'vuex';

//
// factory
//
function CreateComponent(options = {}) {
    const store = new Vuex.Store({
        state: {
            one: 1,
        },
        modules: {
            foo: {
                namespaced: true,
                state: {
                    one: 1,
                },
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
describe('mapTwoWayState', () => {
    it('object syntax', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState({
                test: { key: 'one', mutation: 'setOne' },
            }),
        });

        expect(vm.test).to.equal(1);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.test = 'foo';

        expect(commit.calledWith('setOne', 'foo')).to.be.true;
    });

    it('object syntax (namespaced)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState('foo', {
                test: { key: 'one', mutation: 'setOne' },
            }),
        });

        expect(vm.test).to.equal(1);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.test = 'foo';

        expect(commit.calledWith('foo/setOne', 'foo')).to.be.true;
    });

    it('string synax', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState({
                one: 'setOne',
            }),
        });

        expect(vm.one).to.equal(1);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.one = 'foo';

        expect(commit.calledWith('setOne', 'foo')).to.be.true;
    });

    it('string synax (namespaced)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState('foo', {
                one: 'setOne',
            }),
        });

        expect(vm.one).to.equal(1);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.one = 'foo';

        expect(commit.calledWith('foo/setOne', 'foo')).to.be.true;
    });
});
