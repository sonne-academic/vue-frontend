<template>
  <div class="draggable"
       @mousedown.stop="hang"
       @mouseup.stop="drop">
      <slot></slot>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  name: 'Draggable',
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    parentWidth: {
      type: Number,
      default: 0,
    },
    parentHeight: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
  },
  watch: {
    width(newWidth: number, oldWidth: number) {
      if (newWidth < oldWidth) { return; }
      if (this.left === 0) { return; }
      this.parent.width = this.calcWidth();
      this.parent.height = this.calcHeight();
      if (newWidth > this.parent.width - this.left) {
        const newLeft = this.parent.width - newWidth;
        this.left = newLeft < 0 ? 0 : newLeft;
        const element = this.$el as HTMLElement;
        element.style.left = `${this.left}px`;
      }
    },
    height(newHeight: number, oldHeight: number) {
      if (newHeight < oldHeight) { return; }
      if (this.top === 0) { return; }
      this.parent.width = this.calcWidth();
      this.parent.height = this.calcHeight();

      if (newHeight > this.parent.height - this.top) {
        this.top = this.parent.height - this.height;
        const element = this.$el as HTMLElement;
        element.style.top = `${this.top}px`;
      }
    },
  },
  data: () => ({
    shift: {x: 0, y: 0},
    left: 0,
    top: 0,
    isIos: false,
    parent: {
      width: 0,
      height: 0,
    },
  }),
  methods: {
    elementMove(e: MouseEvent ) {
      // this.$emit("dragging");
      e.preventDefault();
      if (!e.pageX) {
        document.body.style.overflow = 'hidden';
      }
      const x = e.pageX;
      const y = e.pageY;
      let newLeft = x - this.shift.x;
      let newTop = y - this.shift.y;
      const element = this.$el as HTMLElement;
      const newRight = x - this.shift.x + element.offsetWidth;
      const newBottom = y - this.shift.y + element.offsetHeight;
      if (newLeft < 0) {
        newLeft = 0;
      } else if (newRight > this.parent.width) {
        newLeft = this.parent.width - element.offsetWidth;
      } else {
        newLeft = x - this.shift.x;
      }
      if (newTop < 0) {
        newTop = 0;
      } else if (newBottom > this.parent.height) {
        newTop = this.parent.height - element.offsetHeight;
      } else {
        newTop = y - this.shift.y;
      }
      element.style.left = `${newLeft}px`;
      this.left = newLeft;
      element.style.top = `${newTop}px`;
      this.top = newTop;
    },
    calcWidth(): number {
      if (this.parentWidth) {
        return this.parentWidth;
      }
      if (this.$el.parentElement) {
        return this.$el.parentElement.offsetWidth;
      }
      return 0;
    },
    calcHeight(): number {
      if (this.parentHeight) {
        return this.parentHeight;
      }
      if (this.$el.parentElement) {
        return this.$el.parentElement.offsetHeight;
      }
      return 0;

    },
    hang(e: MouseEvent) {
      // this.$emit("activated");
      this.parent.width = this.calcWidth();
      this.parent.height =  this.calcWidth();
      const element = this.$el as HTMLElement;
      this.shift.x = e.pageX - element.offsetLeft;
      this.shift.y = e.pageY - element.offsetTop;
      element.addEventListener('mousemove', this.elementMove);
      this.$el.addEventListener('mouseleave', this.drop);
    },
    drop() {
      // this.$emit("dropped");
      document.body.style.overflow = null;
      const element = this.$el as HTMLElement;
      element.removeEventListener('mousemove', this.elementMove, false);
      element.onmouseup = null;
    },
  },
});
</script>

<style scoped>
.draggable {
  position: absolute;
  left: 1%;
  top: 1%; /*! max-width: 10%; */
  border-style: dashed;
}
</style>
