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


    
    function generateMap(data: Model.FromJSONData): Graph {
        const graph: Graph = new Graph({
            container: document.getElementById(elementId) as HTMLElement,
            // connecting: {
            //     snap: true,
            //     allowBlank: false,
            //     allowLoop: false,
            //     highlight: true,
            //     // validateMagnet({ magnet }) {
            //     //   return magnet.getAttribute('port-group') !== 'top'
            //     // },
            //     // createEdge() {
            //     //     return graph.createEdge({
            //     //         shape: 'dag-edge',
            //     //         attrs: {
            //     //             line: {
            //     //             strokeDasharray: '5 5',
            //     //             },
            //     //         },
            //     //         zIndex: -1,
            //     //   })
            //     // },
            // },
          ...graphOptions,
            
        })
        
        
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
      generateMap
    }

}