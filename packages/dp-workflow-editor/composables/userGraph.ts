import { Graph, Model, Path } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { graphOptions, stepOptions, edgeOptions } from '../utils/graphHelper'
Graph.registerNode(
    'step-node',
    stepOptions);

Graph.registerEdge(
    'dag-edge',
    edgeOptions,
    true,
)

Graph.registerConnector(
    'algo-connector',
    (s, e) => {
      const offset = 4
      const deltaY = Math.abs(e.y - s.y)
      const control = Math.floor((deltaY / 3) * 2)
  
      const v1 = { x: s.x, y: s.y + offset + control }
      const v2 = { x: e.x, y: e.y - offset - control }
  
      return Path.normalize(
        `M ${s.x} ${s.y}
         L ${s.x} ${s.y + offset}
         C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
         L ${e.x} ${e.y}
        `,
      )
    },
    true,
  )


export const useGraph = (elementId:string) => {

    
    function generateMap() {
        const graph: Graph = new Graph({
            container: document.getElementById(elementId) as HTMLElement,
            connecting: {
                snap: true,
                allowBlank: false,
                allowLoop: false,
                highlight: true,
                connector: 'algo-connector',
                connectionPoint: 'anchor',
                anchor: 'center',
                validateMagnet({ magnet }) {
                  return magnet.getAttribute('port-group') !== 'top'
                },
                createEdge() {
                    return graph.createEdge({
                        shape: 'dag-edge',
                        attrs: {
                            line: {
                            strokeDasharray: '5 5',
                            },
                        },
                        zIndex: -1,
                  })
                },
            },
          ...graphOptions,
            
        })
        const data: Model.FromJSONData = {
          nodes: [],
          edges: [],
        }

        data.nodes?.push({
            id: 'start',
            shape: 'step-node',
            label: 'start',
        },{
          id: 'user',
          shape: 'step-node',
          label: 'user', 
        })
        data.edges?.push({
          source: 'start',
          target: 'user',
          shape: "dag-edge",
        })
        
        const dagreLayout = new DagreLayout({
          type: 'dagre',
          rankdir: 'LR',
          ranksep: 35,
          nodesep: 15,
        })
        const model = dagreLayout.layout(data)
        graph.fromJSON(model)
        graph.centerContent()

    }
    

    return {
      generateMap
    }

}