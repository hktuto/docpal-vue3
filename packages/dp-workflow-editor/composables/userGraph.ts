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
        }
    )
        
        
        const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          ranksep: 50,
          nodesep: 50,
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