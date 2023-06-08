<template>
    <div ref="el" class="interactContainer interact">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import {
  bindDragEvents,
  bindDropEvents,
  bindGestureEvents,
  bindPointerEvents,
  bindResizeEvents
} from "./event";
import interact from "interactjs";
import {
  DraggableOptions,
  DropzoneOptions,
  GesturableOptions,
  Interactable,
  InteractStatic,
  ResizableOptions,
  Target
} from "@interactjs/types";
type Props = {
    draggable:boolean,
    dragOption: DraggableOptions,
    resizable: boolean,
    resizeOption: ResizableOptions,
    droppable: boolean,
    dropOption: DropzoneOptions,
    gesturable: boolean,
    gestureOption: GesturableOptions,
}
const props = withDefaults(
    defineProps<Props>(),
    {
        draggable: false,
        dragOption: {},
        resizable: false,
        resizeOption: {},
        droppable: false,
        dropOption: {},
        gesturable: false,
        gestureOption: {},
    }
);
const { draggable, dragOption, resizable, resizeOption, droppable, dropOption, gesturable, gestureOption } = toRefs(props);
const el = ref();

const emit = defineEmits([
    "ready",
    "dragstart",
    "dragmove",
    "draginertiastart",
    "dragend",
    "move",
    "resizestart",
    "resizemove",
    "resizeinertiastart",
    "resizeend",
    "dropactivate",
    "dropdeactivate",
    "dragenter",
    "dragleave",
    "dropmove",
    "drop",
    "gesturestart",
    "gesturemove",
    "gestureend"
]);
const interactInstance = ref()
// const interactInstance = computed({
//     get() {
//         return interactInstance.value;
//     },
//     set(val: InteractStatic) {
//         interactInstance.value = interact;
//     }
// })
function initInteract() {
        interactInstance.value = interact(el.value as Target);
        bindPointerEvents(interactInstance.value, emit.bind(this));
        emit("ready", interactInstance.value);
      }
function initDrag() {
    interactInstance.value?.draggable(dragOption.value);
    bindDragEvents(
        interactInstance.value,
        emit.bind(this)
    );
}

function initResize() {
    interactInstance.value?.resizable(resizeOption.value);
    bindResizeEvents(
        interactInstance.value,
        emit.bind(this)
    );
}

function initDrop() {
        interactInstance.value?.dropzone(dropOption.value);
        bindDropEvents(
          interactInstance.value,
          emit.bind(this)
        );
      }
function initGesture() {
        interactInstance.value?.gesturable(gestureOption.value);
        bindGestureEvents(
          interactInstance.value,
          emit.bind(this)
        );
      }
function reset() {
        destroy();
        init();
      }
function destroy() {
    if(interactInstance.value && interactInstance.value.unset) {
        interactInstance.value?.unset();
    }
    interactInstance.value = null;
}

function init() {
    if (!interactInstance.value) initInteract();
    if (draggable.value) initDrag();
    if (resizable.value) initResize();
    if (droppable.value) initDrop();
    if (gesturable.value) initGesture();

}
onMounted(() => {
    init();
});
onUnmounted(() => {
    destroy();
});

watch(()=>[ draggable,resizable,gesturable,droppable] , (val, oldVal) => {
    if (val !== oldVal) {
      reset();
    }
  });
</script>