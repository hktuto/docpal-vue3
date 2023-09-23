import { Graph, Node, Model, Path } from '@antv/x6'
export const graphOptions = {
            grid:true,
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

export const stepOptions = {
    inherit: 'rect',
    width: 80,
    height: 80,
    attrs: {
        body: {
          stroke: 'red',
          borderRadius: 10,
          rx: 8,
          ry: 8,
        },
        text:{
          fontSize: 10,
          "refX": 0.5,
          "refY": 0.5,
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
    shape: 'step-node',
    label: startEvent['attr_name'],
  });

  // step 4 : add userTask
  userTask.forEach((task: any) => {
    data.nodes?.push({
      id: task['attr_id'],
      shape: 'step-node',
      label: task['attr_name'],
    });
  });

  // step 5: add serviceTask
  serviceTask.forEach((task: any) => {
    data.nodes?.push({
      id: task['attr_id'],
      shape: 'step-node',
      label: task['attr_name'],
    });
  });

  // step 6: add exclusiveGateway
  exclusiveGateway.forEach((gateway: any) => {
    data.nodes?.push({
      id: gateway['attr_id'],
      shape: 'circle',
      label: gateway['attr_name'],
      width: 100,
      height: 100,
      attrs:{
        body: {
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
        label: {
          refX: 0.5,
          refY: '100%',
          refY2: 4,
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
        },
      }
    });
  });

  //step 7: add boundaryEvent
  boundaryEvent.forEach((event: any) => {
    data.nodes?.push({
      id: event['attr_id'],
      shape: 'step-node',
      label: event['attr_name'],
    });
  });

  if(!options.hideEnd) {

    // step 8: add endEvent
    data.nodes?.push({
      id: endEvent['attr_id'],
      shape: 'step-node',
      label: endEvent['attr_name'],
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

  console.log(bpmn,data);

  // finally return data
  return data;
}