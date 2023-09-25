import { Graph, Model, Path } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { graphOptions, stepOptions, edgeOptions } from '../utils/graphHelper'


    

// Graph.registerEdge(
//     'dag-edge',
//     edgeOptions,
//     true,
// )

// Graph.registerConnector(
//     'algo-connector',
//     (s, e) => {
//       const offset = 4
//       const deltaY = Math.abs(e.y - s.y)
//       const control = Math.floor((deltaY / 3) * 2)
  
//       const v1 = { x: s.x, y: s.y + offset + control }
//       const v2 = { x: e.x, y: e.y - offset - control }
  
//       return Path.normalize(
//         `M ${s.x} ${s.y}
//          L ${s.x} ${s.y + offset}
//          C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
//          L ${e.x} ${e.y}
//         `,
//       )
//     },
//     true,
//   )


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