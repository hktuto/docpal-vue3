import {Node, Graph, Cell} from "@antv/x6";

export const removeAllConnection = (node:Node | Cell, graph: Graph) => {
    const connectedNode = graph?.getNeighbors(node,{outgoing:true, incoming:false})
    connectedNode.forEach(item => {
        const child = graph?.getNeighbors(node,{outgoing:true, incoming:false})
        if(child.length > 0) {
            child.forEach( (child) => removeAllConnection(child, graph))
        }
        const data = item.getData();
        if(data.type !== 'startEvent' && data.type !== 'endEvent'){
            item.remove();
        }
    })
    const data = node.getData(); 
    if(data.type !== 'startEvent' && data.type !== 'endEvent'){
        node.remove();
    }
}


export const removeAndJoinNextNode = (node:Node | Cell, graph :Graph) => {
    // remove one level
    const connectedNode = graph?.getNeighbors(node,{outgoing:true, incoming:false})
    const incomingNode = graph?.getNeighbors(node,{outgoing:false, incoming:true})
    connectedNode.forEach(item => {
        // connect incoming node to next node
        incomingNode.forEach(incoming => {
            const incomeData = incoming.getData();
            const itemData = item.getData();
            const newEdges = {
                source: {
                    cell:incoming,
                    port: incomeData.attr_id + '-out' + '-' + (incoming.ports.items.length - 1)
                },
                target: {
                    cell:item,
                    port: itemData.attr_id + '-in' + '-' + (incoming.ports.items.length - 1)
                },
                shape: 'normal-edge',
            }
            graph?.addEdge(newEdges)
        })
        
    })
    const data = node.getData();
    if(data.type !== 'startEvent' && data.type !== 'endEvent'){
        node.remove();
    }
    
}