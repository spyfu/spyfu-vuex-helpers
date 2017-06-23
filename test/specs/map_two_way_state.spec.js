import Vue from 'vue';
import Vuex from 'vuex';

//
// factory
//
function CreateComponent(options = {}) {
    return new Vue({
        el: document.createElement('div'),
        render: h => h('div'),
    });
}

//
// tests
//
describe('mapTwoWayState', () => {
    it.only('normal syntax', () => {
        const vm = CreateComponent();

        console.log ('ok...')
    });

    it.skip('normal syntax (namespaced)', () => {

    });

    it.skip('shorthand', () => {

    });

    it.skip('shorthand (namespaced)', () => {

    });
});
