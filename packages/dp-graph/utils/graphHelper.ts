import { Graph, Node, Model, Path } from '@antv/x6'
import {Attr} from "@antv/x6/es/registry";
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import { register } from '../components/Graph';
import GraphWorkflowForm from '../components/Graph/element/workflow/form.vue';
interface ImageMarkerArgs extends Attr.SimpleAttrs {
    imageUrl: string
    imageWidth?: number
    imageHeight?: number
}
const ports = {
        groups: {
            top: {
                position: 'top',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'var(--color-grey-900)',
                        strokeWidth: 1,
                        fill: '#fff',
                    },
                },
            },
            left: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'var(--color-grey-900)',
                        strokeWidth: 1,
                        fill: '#fff',
                    },
                },
            },
            right: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: 'var(--color-grey-900)',
                        strokeWidth: 1,
                        fill: '#fff',
                    },
                },
            },
        },
    };

register({
    shape: 'form-node',
    width: 80,
    height: 80,
    component: GraphWorkflowForm,
    ports
})
register({
    shape: 'script-node',
    width: 80,
    height: 80,
    component: GraphWorkflowForm,
    ports
})

register({
    shape: 'document-node',
    width: 80,
    height: 80,
    component: GraphWorkflowForm,
    ports
})

register({
    shape: 'email-node',
    width: 80,
    height: 80,
    component: GraphWorkflowForm,
    ports
})

register({
    shape: 'user-node',
    width: 60,
    height: 60,
    component: GraphWorkflowForm,
    ports
})

register({
    shape: 'exclusive-node',
    width: 60,
    height: 60,
    component: GraphWorkflowForm,
    ports
})


/** Service Node */
Graph.registerNode(
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
        ports
    },
    true,
);

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
            stroke: 'var(--color-grey-900)',
            strokeWidth: 1,
            targetMarker: null,
            strokeDasharray: 5,
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
            stroke: 'var(--color-grey-900)',
            strokeWidth: 2,
            
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

export const bpmnToJson = (bpmnText:string) :JSON => {
    const parser = new XMLParser( {
        ignoreAttributes: false,
        attributeNamePrefix : "attr_",
        cdataPropName:     "__cdata",
        allowBooleanAttributes: true,
        parseAttributeValue: true
    });
    return parser.parse(bpmnText);
}

export const jsonToBpmn =  (json:JSON):string => {
    const builder = new XMLBuilder(
        {
            ignoreAttributes: false,
            attributeNamePrefix : "attr_",
            cdataPropName:     "__cdata",
            // @ts-ignore
            allowBooleanAttributes: true,
            suppressBooleanAttributes: false
        }
    );
    return builder.build(json);
}

export const bpmnToX6 = (bpmnText: string | object, options = {hideEnd: true, direction:'top'}): Model.FromJSONData => {
  // step 1 : get bpmn data
    // if bpmnText is Json then skip this step
    let bpmn = bpmnText;
    
    if(typeof bpmnText !== 'object'){
        bpmn = bpmnToJson(bpmnText);
    }
    console.log(bpmn)
    //  remove bpmn object in xml file
    if(bpmn['bpmndi:BPMNDiagram']) {
        delete bpmn['bpmndi:BPMNDiagram']
    }
    const process = bpmn['definitions']['process'];
    
  const startEvent = process['startEvent'];
  const endEvent = process['endEvent'];
  const sequenceFlow = process['sequenceFlow'];
  // check userTask is array or not
  const userTask =  !process['userTask'] ? [] : Array.isArray(process['userTask']) ? process['userTask'] : [process['userTask']];
  const exclusiveGateway = !process['exclusiveGateway'] ? [] :Array.isArray(process['exclusiveGateway']) ? process['exclusiveGateway'] : [process['exclusiveGateway']];
  const serviceTask = !process['serviceTask'] ? [] : Array.isArray(process['serviceTask']) ? process['serviceTask'] : [process['serviceTask']];
  const boundaryEvent = !process['boundaryEvent'] ? [] : Array.isArray(process['boundaryEvent']) ? process['boundaryEvent'] : [process['boundaryEvent']];
  const scriptTask = !process['scriptTask'] ? [] : Array.isArray(process['scriptTask']) ? process['scriptTask'] : [process['scriptTask']];
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
    },
      ports:[
      ]
    
  });

    scriptTask.forEach((task: any) => {
        console.log(task)
        if(!task || !task['attr_id']) return;
        const boundary = boundaryEvent.filter((event: any) => event && event['attr_attachedToRef'] && event['attr_attachedToRef'] === task['attr_id']);
        
        const node = {
            id: task['attr_id'],
            shape: 'script-node',
            label: truncateString(task['attr_name']),
            attrs:{
                title:{
                    text: task['attr_name']
                },
            },

            data: {
                type: 'scriptTask',
                ...task,
                boundary
            },
            ports:[
            ]
        }
        data.nodes?.push(node);
    })
  // step 4 : add userTask
  userTask.forEach((task: any) => {
      // search for boundaryEvent
    const boundary = boundaryEvent.filter((event: any) => event && event['attr_attachedToRef'] && event['attr_attachedToRef'] === task['attr_id']);
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
        },
        ports:[
        ]
    }
    data.nodes?.push(node);
  });

  // step 5: add serviceTask
  serviceTask.forEach((task: any) => {
      const boundary = boundaryEvent.find((event: any) => {
          if(!event || !event['attr_attachedToRef']) return false;
          if( event['attr_attachedToRef'] === task['attr_id'] ) return true;
          
          const target = sequenceFlow.find((flow: any) => flow['attr_sourceRef'] === event['attr_id'] && flow['attr_targetRef'] === task['attr_id']);
          return !!target;
      });
    if(task['attr_flowable:delegateExpression'] === "${sendNotificationDelegate}") {
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'email-node',
        label: truncateString(task['attr_name']),
        data:{
          type: 'serviceTask',
          ...task,
            boundary
        },
          ports:[
          ]
      });
    } else if (task['attr_flowable:delegateExpression'] === "${generateDocumentDelegate}") {
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'document-node',
        label: truncateString(task['attr_name']),
        data: {
          type: 'serviceTask',
          ...task,
            boundary
        },
          ports:[
          ]
      });
    }else{
      data.nodes?.push({
        id: task['attr_id'],
        shape: 'form-node',
        label: truncateString(task['attr_name']),
        data: {
          type: 'serviceTask',
          ...task,
            boundary
        },
          ports:[
          ]
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
        ports:[
        ]
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
          ports:[
          ]
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
    // check how many point linked to endEvent
    const count = sequenceFlow.filter((flow: any) => flow['attr_targetRef'] === endEvent['attr_id']).length;
    const endNote = {
        id: endEvent['attr_id'],
        shape: 'user-node',
        label: truncateString(endEvent['attr_name']),
        data: {
            type: 'endEvent',
            ...endEvent
        },
        ports:[
        ]
    };
    // step 8: add endEvent
    data.nodes?.push(endNote);
    
  }

  // add edge 
  sequenceFlow.forEach((flow: any) => {
    if( (flow['attr_targetRef'] === endEvent['attr_id'] || flow['attr_sourceRef'] === endEvent['attr_id']) && options.hideEnd ) {
      return;
    }
      // create port for source node
      
    // check source is boundaryEvent or not
      // if yes then change source to boundaryEvent[attachedToRef]
    if( boundaryEvent.find((event: any) => event && event['attr_id'] === flow['attr_sourceRef']) ) {
        const boundary = boundaryEvent.find((event: any) => event['attr_id'] === flow['attr_sourceRef']);
        const sourceNode = data.nodes?.find((node) => node.id === boundary['attr_attachedToRef']);
        
        if(!sourceNode) return;
        
        const sourcePort = getAndCreatePorts(sourceNode, 'top')
        
        // // create port for target node
        const targetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef']);
        if(!targetNode) return;
        // check targetNode have in port
       
        const targetPort = getAndCreatePorts(targetNode, 'left')
        

        data.edges?.push({
            source: {
                cell: sourceNode['id'],
                port: sourcePort
            },
            target: {
                cell: targetNode['id'],
                port: targetPort
            },
            shape: 'boundaryEdge',
            data:{
                type: 'boundaryEvent',
                ...boundary 
            }
        });
        return;
    }  
    // check if source is exclusiveGateway
      if( exclusiveGateway.find((gateway: any) => gateway['attr_id'] === flow['attr_sourceRef']) ) {
          const approve = !flow.conditionExpression || flow.conditionExpression.__cdata.includes('!');
          const sourceNode = data.nodes?.find((node) => node.id === flow['attr_sourceRef'] + (approve ? '-reject' : '-approve'));
          if(!sourceNode) return;
          
          const sourcePort = getAndCreatePorts(sourceNode, 'right',approve ? '-reject' : '-approve' )
          // // create port for target node
          const targetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef']);
          if(!targetNode) return;
          const targetPort = getAndCreatePorts(targetNode, 'left')
          data.edges?.push({
              source: {
                  cell: flow['attr_sourceRef'] + (approve ? '-reject' : '-approve'),
                    port: sourcePort
              },
              target: {
                  cell: flow['attr_targetRef'],
                    port: targetPort
              },
              shape: 'normal-edge',
          });
          return
      }
      // check if target is exclusiveGateway
      if( exclusiveGateway.find((gateway: any) => gateway['attr_id'] === flow['attr_targetRef']) ) {
          const sourceNode = data.nodes?.find((node) => node.id === flow['attr_sourceRef']);
          if(!sourceNode) return;
          const sourcePort = getAndCreatePorts(sourceNode, 'right')
          // create port for target node
          const stargetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef'] + '-approve' );
          const rTargetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef'] + '-reject' );
          if(!stargetNode || !rTargetNode) return;
          const stargetPort = getAndCreatePorts(stargetNode, 'left', '-approve')
          const rtargetPort = getAndCreatePorts(rTargetNode, 'left', '-reject')
          

          data.edges?.push({
              source: {
                  cell: flow['attr_sourceRef'],
                    port: sourcePort
              },
              target: {
                  cell: flow['attr_targetRef'] + '-approve',
                    port: stargetPort
              },
              shape: 'normal-edge',
          });
          data.edges?.push({
              source: {
                  cell:flow['attr_sourceRef'],
                    port: sourcePort
              },
              target: {
                  cell: flow['attr_targetRef'] + '-reject',
                    port: rtargetPort
              },
              shape: 'normal-edge',
          });
          return
      }

      const sourceNode = data.nodes?.find((node) => node.id === flow['attr_sourceRef']);
      if(!sourceNode) return;
      // create port for target node
      const targetNode = data.nodes?.find((node) => node.id === flow['attr_targetRef']);
      
      const targetPort = getAndCreatePorts(targetNode, 'left')
      const sourcePort = getAndCreatePorts(sourceNode, 'right')
      data.edges?.push({
          source: {
              cell:flow['attr_sourceRef'],
                port: sourcePort
          },
          target: {
              cell:flow['attr_targetRef'],
                port: targetPort
          },
          shape: 'normal-edge',
        });
  });


  // finally return data
  return data;
}

export const getAndCreatePorts = (node :Node.Metadata, group:string, suffix:string = "") => {
    if(!node || !node.data){
        console.log(node);
    }
    let portId = node.data.attr_id + suffix + '-'  + group;
    const port = node.ports?.find((port: any) => port.group === group)
    if(port) {
        portId = port.id;
    } else {
        node.ports?.push({
            id: portId ,
            group: group,
        })
    }
    return portId
}