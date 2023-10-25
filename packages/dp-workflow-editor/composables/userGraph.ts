import { Graph, Model, Path } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { graphOptions, stepOptions, edgeOptions } from '../utils/graphHelper'

export const FormNode = Graph.registerNode(
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
export const DocumentNode = Graph.registerNode(
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

export const EmailNode = Graph.registerNode(
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
export const userNode = Graph.registerNode(
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

export const ServiceNode = Graph.registerNode(
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

export const ExclusiveNode = Graph.registerNode(
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