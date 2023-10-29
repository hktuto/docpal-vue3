import { Graph } from '@antv/x6'
import type {Options as GraphOptions} from '@antv/x6'
import { DagreLayout, Model } from '@antv/layout'





export const useGraph = (elementId:string) => {
    
    function generateMap(data: Partial<Model>, options: Partial<GraphOptions.Manual>, layout: DagreLayout): Graph {
        const graph: Graph = new Graph({
            container: document.getElementById(elementId) as HTMLElement,
            ...options,
        })
        
        
        const model = layout.layout(data)
        graph.fromJSON(model)
        graph.centerContent()
        return graph;
      
    }
    

    return {
      generateMap,
    }

}