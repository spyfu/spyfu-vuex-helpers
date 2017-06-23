# spyfu-vuex-helpers

[![Build status](https://img.shields.io/circleci/project/github/spyfu/spyfu-vuex-helpers.svg)](https://circleci.com/gh/spyfu/spyfu-vuex-helpers)
[![Coverage](https://img.shields.io/codecov/c/token/ZnYz3FuhI5/github/spyfu/spyfu-vuex-helpers.svg)](https://codecov.io/gh/spyfu/spyfu-vuex-helpers)
[![npm](https://img.shields.io/npm/v/spyfu-vuex-helpers.svg)](https://www.npmjs.com/package/spyfu-vuex-helpers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/spyfu/spyfu-vuex-helpers/blob/master/LICENSE)

<a name="introduction"></a>
### Introduction

This utility makes two way computed properties, so your components can more easily interface with Vuex.

```bash
# install through npm
$ npm install spyfu-vuex-helpers

# or with yarn
$ yarn add spyfu-vuex-helpers
```

<a name="map-two-way-state"></a>
### mapTwoWayState

Frequently, you'll need to both get and mutate Vuex state from a component. We can do this with a [two way computed property](https://vuejs.org/v2/guide/computed.html#Computed-Setter).

```js
export default {
    computed: {
        isLoading: {
            get() {
                return this.$store.state.namespace.isLoading;
            },
            set(value) {
                this.$store.commit('namespace/setIsLoading', value);
            },
        },
    },
}
```

To make this less verbose, use the `mapTwoWayState` helper. The `namespace` argument is optional.

```js
import { mapTwoWayState } from 'spyfu-vuex-helpers';

export default {
    computed: {
        ...mapTwoWayState('namespace', {
            isLoading: 'setIsLoading',
        }),
    },
}
```

In the above example, your Vuex state will be exposed as `isLoading`. When you modify this, the `namespace/setIsLoading` mutation will be called. If you need to use a name different from your key in Vuex, use the following object syntax.

```js
thingIsLoading: { key: 'isLoading', mutation: 'setIsLoading' }
```
