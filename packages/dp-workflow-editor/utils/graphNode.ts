import { Graph, Node, Model, Path } from '@antv/x6'

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


