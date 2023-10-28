import { Graph, Model, Path } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { graphOptions, stepOptions, edgeOptions } from '../utils/graphHelper'



export const useGraph = (elementId:string) => {

    const formTypeOptions = [
      {
        type:"string",
        label:"String",
        optionsData: [

        ]
      },
      {
        type:"boolean",
        label: "Boolean",
        optionsData: [
          
        ]
      },
      {
        type: 'date',
        label: 'Date',
        optionsData: [
          {"attr_datePattern":"yyyy-MM-dd HH:mm:ss"}
        ]
      }
    ]

    
    function generateMap(data: Model.FromJSONData): Graph {
        const graph: Graph = new Graph({
            container: document.getElementById(elementId) as HTMLElement,
            grid:true,
            autoResize:true,
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
                factor: 0.5,
                maxScale: 1.5,
                minScale: 0.2,
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
            connecting: {
                snap: true,
                allowBlank: false,
                allowLoop: false,
                highlight: true,
                connectionPoint: 'anchor',
                anchor: 'center',
                validateMagnet({ magnet }) {
                    return magnet.getAttribute('port-group') !== 'top'
                },
                createEdge() {
                    return graph.createEdge({
                        shape: 'normal-edge',
                        attrs: {
                            line: {
                                strokeDasharray: '5 5',
                            },
                        },
                        zIndex: -1,
                    })
                },
            },
            
        }
    )
        
        
        const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          ranksep: 40,
          nodesep: 60,
        })
        const model = dagreLayout.layout(data)
        graph.fromJSON(model)
        graph.centerContent()
        return graph;
      
    }
    

    return {
      generateMap,
      formTypeOptions
    }

}