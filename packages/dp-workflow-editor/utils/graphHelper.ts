import { Graph, Node, Model, Path } from '@antv/x6'
import {Attr} from "@antv/x6/es/registry";


interface ImageMarkerArgs extends Attr.SimpleAttrs {
    imageUrl: string
    imageWidth?: number
    imageHeight?: number
}
const graphOptions = {
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
            
        selecting: {
        enabled: true,
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
    },
}


const FormNode = Graph.registerNode(
    'form-node',
    {
        inherit: 'rect',
        width: 80,
        height: 80,
        attrs: {
            body: {
                rx: 20,
                ry: 20,
                fill: '#0099ff',
                strokeWidth:0,
            },
            image:{
                'xlink:href':'/bpmn/icons/form.svg',
                width: 60,
                height: 60,
                refX: 10,
                refY: 10,
            },
            text:{
                refX: 0.5,
                refY: '120%',
                refY2: 5,
                "textAnchor": "middle",
                "textVerticalAnchor": "middle",
                "fontFamily": "Arial, helvetica, sans-serif",
                "text": "node"
            }
        },
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'img',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
    },
    true,
)
const DocumentNode = Graph.registerNode(
    'document-node',
    {
        inherit: 'rect',
        width: 80,
        height: 80,
        attrs: {
            body: {
                rx: 20,
                ry: 20,
                fill: '#7B61FF',
                strokeWidth:0,
            },
            image:{
                'xlink:href':'/bpmn/icons/document.svg',
                width: 60,
                height: 60,
                refX: 10,
                refY: 10,
            },
            text:{
                refX: 0.5,
                refY: '120%',
                refY2: 5,
                "textAnchor": "middle",
                "textVerticalAnchor": "middle",
                "fontFamily": "Arial, helvetica, sans-serif",
                "text": "node"
            }
        },
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'img',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
    },
    true,
)

const EmailNode = Graph.registerNode(
    'email-node',
    {
        inherit: 'rect',
        width: 80,
        height: 80,
        attrs: {
            body: {
                rx: 20,
                ry: 20,
                fill: '#29CC6A',
                strokeWidth:0,
            },
            image:{
                'xlink:href':'/bpmn/icons/email.svg',
                width: 60,
                height: 60,
                refX: 10,
                refY: 10,
            },
            text:{
                refX: 0.5,
                refY: '120%',
                refY2: 5,
                "textAnchor": "middle",
                "textVerticalAnchor": "middle",
                "fontFamily": "Arial, helvetica, sans-serif",
                "text": "node"
            }
        },
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'img',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ],
    },
    true,
)
const userNode = Graph.registerNode(
    'user-node',
    {
        inherit: 'rect',
        width: 80,
        height: 80,
        attrs: {
            body: {
                rx: 20,
                ry: 20,
            },

            text:{
                refX: 0.5,
                refY: '120%',
                refY2: 5,
                "textAnchor": "middle",
                "textVerticalAnchor": "middle",
                "fontFamily": "Arial, helvetica, sans-serif",
                "text": "node"
            }
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
    },
    true
);

const ServiceNode = Graph.registerNode(
    'service-node',
    {
        inherit: 'rect',
        width: 40,
        height: 40,
        attrs: {
            body: {
                rx: 8,
                ry: 8,
            },
            text: {
                refX: 0.5,
                refY: '120%',
                refY2: 5,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                fontFamily: 'Arial, helvetica, sans-serif',
                text: 'node',
            },
        },
    },
    true,
);

const ExclusiveNode = Graph.registerNode(
    'exclusive-node',
    {
        inherit: 'circle',
        width:60,
        height:60,
        attrs:{
            body: {
                fill: '#26C7D6',
                strokeWidth: 0,
            },
            label: {
                refX: 0.5,
                refY: '100%',
                refY2: 4,
                textAnchor: 'middle',
                textVerticalAnchor: 'top',
            },
        }
    },
    true
)
Graph.registerMarker('image', (args: ImageMarkerArgs) => {
    const {imageUrl, imageWidth, imageHeight, ...attrs} = args
    return {
        ...attrs, // 原样返回非特殊涵义的参数
        tagName: 'image', // 使用 <image> 标签渲染箭头，其余键值对都将作为该元素的属性。
        width: imageWidth,
        height: imageHeight,
        'xlink:href': imageUrl,
    }
})
const edgeConfig = {
    router:{
        name: 'manhattan',
        args: {
            startDirections: ['right'],
            endDirections: ['left'],
        },
    },
    connector:{
        name: 'rounded',
        args:{
            radius: 10,
        }
    },
}
const boundaryEdge = Graph.registerEdge('boundaryEdge',{
    ...edgeConfig,
    attrs: {
        line: {
            stroke: '#000',
            strokeWidth: 1,
            targetMarker: null,
            sourceMarker: {
                name: 'image',
                imageUrl: '/bpmn/icons/clock.svg',
                imageWidth: 40,
                imageHeight: 40,
                y: -20,
                x: -20,
            },
        },
    },
    router:{
        name: 'manhattan',
        args: {
            startDirections: ['top'],
            endDirections: ['left'],
        },
    },
})

const normalEdge = Graph.registerEdge('normal-edge',{
    ...edgeConfig,
    attrs: {
        line: {
            stroke: '#000',
            strokeWidth: 1,
        },
    },
    
})

function truncateString(str, n=20) {
  if(!str) return str;
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

export const bpmnToX6 = (bpmn: any, options = {hideEnd: true}): Model.FromJSONData => {
  // step 1 : get bpmn data
  const process = bpmn['definitions']['process'];
  const nodes = [];
  const startEvent = process['startEvent'];
  const endEvent = process['endEvent'];
  const sequenceFlow = process['sequenceFlow'];
  // check userTask is array or not
  const userTask =  Array.isArray(process['userTask']) ? process['userTask'] : [process['userTask']];;
  const exclusiveGateway = Array.isArray(process['exclusiveGateway']) ? process['exclusiveGateway'] : [process['exclusiveGateway']];;
  const serviceTask = Array.isArray(process['serviceTask']) ? process['serviceTask'] : [process['serviceTask']];
  const boundaryEvent = Array.isArray(process['boundaryEvent']) ? process['boundaryEvent'] : [process['boundaryEvent']];
  // step 2 define x6 graph json data
  const data: Model.FromJSONData = {
    nodes: [],
    edges: [],
  };

  // step 3 : push start node
  data.nodes?.push({
    id: startEvent['attr_id'],
    shape: 'form-node',
    label: truncateString(startEvent['attr_name']),
    attrs:{
      title:{
        text: startEvent['attr_name']
      }
    },
    data: {
      type: 'userTask',
      ...startEvent
    }
    
  });

  // step 4 : add userTask
  userTask.forEach((task: any) => {
      // search for boundaryEvent
    const boundary = boundaryEvent.filter((event: any) => event['attr_attachedToRef'] === task['attr_id']);
    const node = {
        id: task['attr_id'],
        shape: 'form-node',
        label: truncateString(task['attr_name']),
        attrs:{
            title:{
                text: task['attr_name']
            },
        },
        
        data: {
            type: 'userTask',
            ...task,
            boundary
        }
    }
    data.nodes?.push(node);
  });

  // step 5: add serviceTask
  serviceTask.forEach((task: any) => {
    if(task['attr_flowable:delegateExpression'] === "${sendNotificationDelegate}") {
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'email-node',
        label: truncateString(task['attr_name']),
        data:{
          type: 'serviceTask',
          ...task
        }
      });
    } else if (task['attr_flowable:delegateExpression'] === "${generateDocumentDelegate}") {
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'document-node',
        label: truncateString(task['attr_name']),
        data: {
          type: 'serviceTask',
          ...task
        }
      });
    }else{
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'form-node',
        label: truncateString(task['attr_name']),
        data: {
          type: 'serviceTask',
          ...task
        }
      });
    }
  });

  // step 6: add exclusiveGateway
  exclusiveGateway.forEach((gateway: any) => {
      
    data.nodes?.push({
      id: gateway['attr_id'] + '-approve',
      shape: 'exclusive-node',
      label: "Approve",
      data: {
        type: 'exclusiveGateway',
        ...gateway
      },
    });

      data.nodes?.push({
          id: gateway['attr_id'] + '-reject',
          shape: 'exclusive-node',
          label: "Reject",
          attrs: {
              body: {
                  fill: 'red',
                  strokeWidth: 0,
              },
          },
          data: {
              type: 'exclusiveGateway',
              ...gateway
          },
      });
  });

  //step 7: add boundaryEvent
  // boundaryEvent.forEach((event: any) => {
  //     console.log(event);
  //   data.nodes?.push({
  //     id: event['attr_id'],
  //     shape: 'user-node',
  //     label: truncateString(event['attr_name']),
  //   });
  // });

  if(!options.hideEnd) {

    // step 8: add endEvent
    data.nodes?.push({
      id: endEvent['attr_id'],
      shape: 'user-node',
      label: truncateString(endEvent['attr_name']),
        data: {
            type: 'endEvent',
            ...endEvent
        }
    });
    
  }

  // add edge 
  sequenceFlow.forEach((flow: any) => {
    if( (flow['attr_targetRef'] === endEvent['attr_id'] || flow['attr_sourceRef'] === endEvent['attr_id']) && options.hideEnd ) {
      return;
    }
    // check source is boundaryEvent or not
      // if yes then change source to boundaryEvent[attachedToRef]
    if( boundaryEvent.find((event: any) => event['attr_id'] === flow['attr_sourceRef']) ) {
        const boundary = boundaryEvent.find((event: any) => event['attr_id'] === flow['attr_sourceRef']);
        data.edges?.push({
            source: boundary['attr_attachedToRef'],
            target: flow['attr_targetRef'],
            shape: 'boundaryEdge',
        });
        return;
    }  
    // check if source is exclusiveGateway
      if( exclusiveGateway.find((gateway: any) => gateway['attr_id'] === flow['attr_sourceRef']) ) {
          const gateway = exclusiveGateway.find((gateway: any) => gateway['attr_id'] === flow['attr_sourceRef']);
          // get taget node
            const targetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef']);
            console.log(targetNode, flow)
          data.edges?.push({
              source: flow['attr_sourceRef'] + (flow.conditionExpression.__cdata.includes('!') ? '-reject' : '-approve' ),
              target: flow['attr_targetRef'],
              shape: 'normal-edge',
          });
            console.log(targetNode.data);
          return
      }
      // check if target is exclusiveGateway
      if( exclusiveGateway.find((gateway: any) => gateway['attr_id'] === flow['attr_targetRef']) ) {
          data.edges?.push({
              source: flow['attr_sourceRef'],
              target: flow['attr_targetRef'] + '-approve',
              shape: 'normal-edge',
          });
          data.edges?.push({
              source: flow['attr_sourceRef'],
              target: flow['attr_targetRef'] + '-reject',
              shape: 'normal-edge',
          });
          return
      }
    data.edges?.push({
      source: flow['attr_sourceRef'],
      target: flow['attr_targetRef'],
      shape: 'normal-edge',
    });
  });


  // finally return data
  return data;
}