import { Graph, Node, Model, Path } from '@antv/x6'
export const graphOptions = {
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
    data.nodes?.push({
      id: task['attr_id'],
      shape: 'form-node',
      label: truncateString(task['attr_name']),
      data: {
        type: 'userTask',
        ...task}
    });
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
    } else if (task['attr_flowable:delegateExpression'] === "${approvedDelegate}") {
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
      id: gateway['attr_id'],
      shape: 'exclusive-node',
      label: "approval",
      data: {
        type: 'exclusiveGateway',
        ...gateway
      },
      
    });
  });

  //step 7: add boundaryEvent
  boundaryEvent.forEach((event: any) => {
    data.nodes?.push({
      id: event['attr_id'],
      shape: 'user-node',
      label: truncateString(event['attr_name']),
    });
  });

  if(!options.hideEnd) {

    // step 8: add endEvent
    data.nodes?.push({
      id: endEvent['attr_id'],
      shape: 'step-node',
      label: truncateString(endEvent['attr_name']),
    });
    
  }

  // add edge 
  sequenceFlow.forEach((flow: any) => {
    if( (flow['attr_targetRef'] === endEvent['attr_id'] || flow['attr_sourceRef'] === endEvent['attr_id']) && options.hideEnd ) {
      return;
    }
    data.edges?.push({
      source: flow['attr_sourceRef'],
      target: flow['attr_targetRef'],
      shape: 'edge',
    });
  });


  // finally return data
  return data;
}