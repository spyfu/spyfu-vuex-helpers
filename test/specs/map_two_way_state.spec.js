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
        modules: {
            foo: {
                namespaced: true,
                modules: {
                    bar: {
                        namespaced: true,
                        state: {
                            three: 3,
                        },
                    },
                },
                state: {
                    two: 2,
                },
            },
        },
        state: {
            one: 1,
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
                test: { key: 'two', mutation: 'setTwo' },
            }),
        });

        expect(vm.test).to.equal(2);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.test = 'new two';

        expect(commit.calledWith('foo/setTwo', 'new two')).to.be.true;
    });

    it('object syntax (nested namespace)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState('foo/bar', {
                test: { key: 'three', mutation: 'setThree' },
            }),
        });

        expect(vm.test).to.equal(3);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.test = 'new three';

        expect(commit.calledWith('foo/bar/setThree', 'new three')).to.be.true;
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
                two: 'setTwo',
            }),
        });

        expect(vm.two).to.equal(2);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.two = 'new two';

        expect(commit.calledWith('foo/setTwo', 'new two')).to.be.true;
    });

    it('string syntax (nested namespace)', () => {
        /* eslint-disable */
        const vm = CreateComponent({
            computed: mapTwoWayState('foo/bar', {
                three: 'setThree',
            }),
        });

        expect(vm.three).to.equal(3);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.three = 'new three';

        expect(commit.calledWith('foo/bar/setThree', 'new three')).to.be.true;
    });
});
