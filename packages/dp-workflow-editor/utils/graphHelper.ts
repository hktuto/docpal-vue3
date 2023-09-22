import { Graph, Node, Path } from '@antv/x6'
export const graphOptions = {
            grid:true,
            background: {
              color: '#F2F7FA',
            },
            panning: {
                enabled: true,
                eventTypes: ['leftMouseDown', 'mouseWheel'],
            },
            mousewheel: {
                enabled: true,
                modifiers: 'ctrl',
                factor: 1.1,
                maxScale: 1.5,
                minScale: 0.5,
            },
            highlighting: {
                magnetAdsorbed: {
                  name: 'stroke',
                  args: {
                    attrs: {
                      fill: '#fff',
                      stroke: '#31d0c6',
                      strokeWidth: 4,
                    },
                  },
                },
            },
            
        selecting: {
        enabled: true,
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
    },
}

export const stepOptions = {
    inherit: 'rect',
        width: 80,
        height: 80,
        attrs: {
            body: {
              stroke: 'red',
            },
          },
          markup: [
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
        ports: {
            groups: {
              top: {
                position: 'top',
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff',
                  },
                },
              },
              bottom: {
                position: 'bottom',
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff',
                  },
                },
              },
            },
          },
}

export const edgeOptions = {
    inherit: 'edge',
    attrs: {
    line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null,
    },
    },
}