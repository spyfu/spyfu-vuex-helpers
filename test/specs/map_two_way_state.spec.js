import Vue from 'vue';
import sinon from 'sinon';
import { Store } from 'vuex'
import { expect } from 'chai';
import { mapTwoWayState } from '../../lib';

//
// factory
//
function CreateComponent(options = {}) {
    const store = new Store({
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
                    child: {
                        five: 5,
                    },
                },
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

    it('object syntax (namespaced, child object)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState('foo', {
                test: { key: 'child.five', mutation: 'setTwo' },
            }),
        });

        expect(vm.test).to.equal(5);

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

    it('object syntax (child object)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState({
                test: { key: 'child.four', mutation: 'setFour' },
            }),
        });

        expect(vm.test).to.equal(4);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.test = 'new four';

        expect(commit.calledWith('setFour', 'new four')).to.be.true;
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

    it('string syntax (namespaced)', () => {
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

    it('string syntax, (namespaced, child object', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState('foo', {
                'child.five': 'setFive',
            }),
        });

        expect(vm.five).to.equal(5);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.five = 'new five';

        expect(commit.calledWith('foo/setFive', 'new five')).to.be.true;
    });

    it('string syntax (nested namespace)', () => {
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

    it('string syntax (child object)', () => {
        const vm = CreateComponent({
            computed: mapTwoWayState({
                'child.four': 'setFour',
            }),
        });

        expect(vm.four).to.equal(4);

        const commit = sinon.stub(vm.$store, 'commit');
        vm.four = 'new four';

        expect(commit.calledWith('setFour', 'new four')).to.be.true;
    });

    it('throws an error when an array is provided as the state mapping', () => {
        expect(() => mapTwoWayState([])).to.throw();
        expect(() => mapTwoWayState('namespace', [])).to.throw();
    });
});
