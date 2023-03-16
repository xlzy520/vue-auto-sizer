<template>
  <div :class="className" ref="autoSizer" :style="{ ...outerStyle, ...wrapperStyle }">
    <!-- 传递给子组件的高度和宽度参数 -->
    <slot :height="childParams.height" :width="childParams.width"></slot>
  </div>
</template>

<script>
// 导入resize监听器
import createDetectElementResize from './vendor/detectElementResize';

export default {
  name: 'AutoSizer',
  props: {
    // 渲染子组件的函数
    // 函数接收一个对象参数，包含高度和宽度两个属性
    children: Function,

    // 自定义CSS类名
    className: String,

    // 初始渲染时使用的默认高度
    defaultHeight: Number,

    // 初始渲染时使用的默认宽度
    defaultWidth: Number,

    // 禁用高度动态计算
    disableHeight: {
      type: Boolean,
      default: false,
    },

    // 禁用宽度动态计算
    disableWidth: {
      type: Boolean,
      default: false,
    },

    // Content Security Policy中的Nonce值
    nonce: String,

    // 组件在大小变化时调用的回调函数
    // 回调函数接收一个对象参数，包含高度和宽度两个属性
    onResize: {
      type: Function,
      default: () => {},
    },

    // 内联样式, Vue不能直接使用style属性
    wrapperStyle: {
      type: Object,
      default: () => ({}),
    },
  },

  // 组件默认属性
  data() {
    return {
      height: this.defaultHeight || 0,
      width: this.defaultWidth || 0,
      parentNode: null,
      detectElementResize: null,
    };
  },

  // 组件挂载时执行
  mounted() {
    const { nonce } = this;
    if (
        this.$refs.autoSizer &&
        this.$refs.autoSizer.parentNode &&
        this.$refs.autoSizer.parentNode.ownerDocument &&
        this.$refs.autoSizer.parentNode.ownerDocument.defaultView &&
        this.$refs.autoSizer.parentNode instanceof this.$refs.autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      // 延迟访问父节点，以处理已卸载的情况
      // 这样可以避免引发错误
      this.parentNode = this.$refs.autoSizer.parentNode;
      const win = this.window || window;

      // 延迟引入resize监听器，以支持SSR
      this.detectElementResize = createDetectElementResize(nonce, win);
      this.detectElementResize.addResizeListener(this.parentNode, this.onResizeHandler);

      // 在挂载后立即触发一次onResizeHandler方法
      this.onResizeHandler();
    }
  },

  // 组件更新时执行
  updated() {
    this.onResizeHandler();
  },

  // 组件卸载时执行
  beforeDestroy() {
    if (this.detectElementResize && this.parentNode) {
      this.detectElementResize.removeResizeListener(this.parentNode, this.onResizeHandler);
    }
  },

  computed: {
    // 根据disableHeight和disableWidth属性计算outerStyle和childParams
    outerStyle() {
      const style = { overflow: 'visible' };
      if (!this.disableHeight) style.height = 0;
      if (!this.disableWidth) style.width = 0;
      return style;
    },
    childParams() {
      const params = {};
      if (!this.disableHeight) params.height = this.height;
      if (!this.disableWidth) params.width = this.width;
      return params;
    },
  },

  methods: {
    // 当父元素大小发生变化时触发的回调函数
    onResizeHandler() {
      const { disableHeight, disableWidth, onResize } = this;

      if (this.parentNode) {
        // 处理AutoSizer组件立即被添加到DOM中又立即被删除的情况
        // 避免出现无效的样式值，防止出现NaN值
        const height = this.parentNode.offsetHeight || 0;
        const width = this.parentNode.offsetWidth || 0;

        const win = this.window || window;
        const style = win.getComputedStyle(this.parentNode) || {};
        const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
        const paddingRight = parseInt(style.paddingRight, 10) || 0;
        const paddingTop = parseInt(style.paddingTop, 10) || 0;
        const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

        const newHeight = height - paddingTop - paddingBottom;
        const newWidth = width - paddingLeft - paddingRight;

        if ((!disableHeight && this.height !== newHeight) || (!disableWidth && this.width !== newWidth)) {
          this.height = newHeight;
          this.width = newWidth;

          onResize({ height, width });
        }
      }
    },
  },

  // 组件渲染函数
  render(h) {
    return h(
        'div',
        {
          class: this.className,
          ref: 'autoSizer',
          style: this.outerStyle,
        },
        [this.$scopedSlots.default(this.childParams)],
    );
  },
};
</script>
