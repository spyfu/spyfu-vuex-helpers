# spyfu-vuex-helpers

[![Build status](https://img.shields.io/circleci/project/github/spyfu/spyfu-vuex-helpers.svg)](https://circleci.com/gh/spyfu/spyfu-vuex-helpers)
[![Coverage](https://img.shields.io/codecov/c/token/ZnYz3FuhI5/github/spyfu/spyfu-vuex-helpers.svg)](https://codecov.io/gh/spyfu/spyfu-vuex-helpers)
[![Dev dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vuex-helpers.svg)](#)
[![npm](https://img.shields.io/npm/v/spyfu-vuex-helpers.svg)](https://www.npmjs.com/package/spyfu-vuex-helpers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/spyfu/spyfu-vuex-helpers/blob/master/LICENSE)

<a name="introduction"></a>
### Introduction

These utility functions are intended for use with [Vuex](https://vuex.vuejs.org/en). 

```bash
# install through npm
$ npm install spyfu-vuex-helpers

# or with yarn
$ yarn add spyfu-vuex-helpers
```

<a name="map-two-way-state"></a>
### mapTwoWayState

Occasionally, you'll need to both get and mutate Vuex state from a component. Normally, you might use a [two way computed property](https://vuejs.org/v2/guide/computed.html#Computed-Setter).

```js
export default {
    computed: {
        isLoading: {
            get() {
                return this.$store.state.isLoading;
            },
            set(value) {
                this.$store.commit('setIsLoading', value);
            },
        },
    },
}
```

To avoid writing these redundant getters and setters, we can use the `mapTwoWayState` helper. An optional store `namespace` may be passed in as the first argument.

```js
import { mapTwoWayState } from 'spyfu-vuex-helpers';

export default {
    computed: {
        ...mapTwoWayState({
            isLoading: 'setIsLoading',
        }),
    },
}
```

In the above example, your Vuex state will be exposed as `isLoading`. When updated, the `setIsLoading` mutation will be called. If you need to use a different key name from the one in Vuex, use the following object syntax.

```js
thingIsLoading: { key: 'isLoading', mutation: 'setIsLoading' }
```

<a name="find-instance-then"></a>
### findInstanceThen

This function helps with keeping multiple copies of the same state. One way to do this is for your state to be nothing more than an array of objects. The `findInstanceThen` helper can then be used to map your mutations to a particular instance.

```js
import { findInstanceThen } from 'spyfu-vuex-helpers';

export default {
    // state should contain an array called "instances"
    // with each instance defining an "id" property.
    state: {
        instances: [],
    },
    
    // to mutate particular instances, use the findInstanceThen
    // function and attach an "id" property to your payload.
    mutations: {
        someMutation: findInstanceThen((instance, payload, state) => {
            instance.foo = payload.value;
        }),
    },
}
```

If you need to use a state key other than `instances`, or an instance key other than `id`, use the `config` method.

```js
import helpers from 'spyfu-vuex-helpers';

const findInstanceThen = helpers.findInstanceThen.config({
    stateKey: 'foo', 
    instanceKey: 'bar',
});
```

### License

[MIT](https://github.com/spyfu/spyfu-vuex-helpers/blob/master/LICENSE)

Copyright (c) 2017-present, [SpyFu](https://spyfu.com)
