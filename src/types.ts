export interface GraphNode {
    id: string
    label: string
    type: string
    properties?: Record<string, string>
    style?: {
      color?: string
      shape?: string
      [key: string]: string | number | boolean | undefined | unknown
    }
    group?: string
    selected?: boolean
    searchMatch?: boolean
  }
  
  export interface GraphEdge {
    source: string
    target: string
    label?: string
    direction?: "one-way" | "two-way"
    style?: {
      dashed?: boolean
      color?: string
      width?: number
      animated?: boolean
      [key: string]: string | number | boolean | undefined | unknown
    }
  }
  
  export interface GraphData {
    nodes: GraphNode[]
    edges: GraphEdge[]
    meta?: {
      title?: string
      description?: string
      [key: string]: string | number | boolean | undefined | unknown
    }
  }
  