import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

export interface LayoutOptions {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
  nodesep?: number;
  ranksep?: number;
  marginx?: number;
  marginy?: number;
}

const defaultOptions: LayoutOptions = {
  rankdir: 'TB',
  nodesep: 50,
  ranksep: 90,
  marginx: 20,
  marginy: 20,
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } => {
  const opts = { ...defaultOptions, ...options };
  
  const g = new dagre.graphlib.Graph();
  g.setGraph(opts);
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    g.setNode(node.id, { 
      width: node.measured?.width || 220, 
      height: node.measured?.height || 80 
    });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Apply layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - (node.measured?.width || 220) / 2,
        y: nodeWithPosition.y - (node.measured?.height || 80) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};