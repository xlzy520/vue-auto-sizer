# vue-auto-sizer

A Vue component that automatically adjusts the width and height of its children to fill the available space.Clone of react-virtualized-auto-sizer.

一个自动调整其子组件的宽度和高度以填充可用空间的Vue组件。react-virtualized-auto-sizer的复制版。


## Install

```bash
npm install --save @zhibi/vue-auto-sizer
yarn add @zhibi/vue-auto-sizer
pnpm add @zhibi/vue-auto-sizer
```

## Usage
```vue
<template>
  <div>
    <vue-auto-sizer>
      <template slot-scope="{ width, height }">
        <div :style="{ width: width + 'px', height: height + 'px' }">
          <div>Width: {{ width }}</div>
          <div>Height: {{ height }}</div>
        </div>
      </template>
    </vue-auto-sizer>
  </div>
</template>

<script>
  import VueAutoSizer from '@zhibi/vue-auto-sizer'
  export default {
    components: {
      VueAutoSizer
    }
  }
</script>
```

## Documentation

Please see API documentation of "AutoSizer" in `react-virtualized` package [here](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md).

## License

MIT © [bvaughn](https://github.com/bvaughn)
