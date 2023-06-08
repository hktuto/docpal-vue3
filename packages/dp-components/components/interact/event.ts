export const dragEvents = [
    "dragstart",
    "dragmove",
    "draginertiastart",
    "dragend"
  ];
  export const resizeEvents = [
    "resizestart",
    "resizemove",
    "resizeinertiastart",
    "resizeend"
  ];
  export const dropEvents = [
    "dropactivate",
    "dropdeactivate",
    "dragenter",
    "dragleave",
    "dropmove",
    "drop"
  ];
  export const gestureEvents = ["gesturestart", "gesturemove", "gestureend"];
  export const pointerEvents = [
    "down",
    "move",
    "up",
    "cancel",
    "tap",
    "doubletap",
    "hold"
  ];
  import { Interactable } from "@interactjs/types";
  
  const bindEvents = (events: string[]) => (
    interact: Interactable,
    emit:any
  ): void => {
    events.forEach(eventName => {
      interact.on(eventName, (...args: unknown[]) => {
        emit(eventName, ...args);
      });
    });
  };
  
  export const bindPointerEvents = bindEvents(pointerEvents);
  export const bindDragEvents = bindEvents(dragEvents);
  export const bindDropEvents = bindEvents(dropEvents);
  export const bindResizeEvents = bindEvents(resizeEvents);
  export const bindGestureEvents = bindEvents(gestureEvents);
  export default {}
  