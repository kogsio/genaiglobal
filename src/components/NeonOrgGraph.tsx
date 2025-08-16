import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
} from '@xyflow/react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_ICON, ORG_UNITS, OrgUnit } from '@/data/orgChart';
import { getLayoutedElements } from '@/lib/layoutDagre';
import GroupNode from '@/components/nodes/GroupNode';
import OrgTabs from '@/components/OrgTabs';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  group: GroupNode,
};

interface GraphContentProps {}

const GraphContent = ({}: GraphContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const { fitView, setCenter } = useReactFlow();

  // Get pillars for tabs
  const pillars = useMemo(() => 
    ORG_UNITS.filter(unit => unit.type === 'pillar'),
    []
  );

  // Filter units based on active tab and expansion state
  const visibleUnits = useMemo(() => {
    let filtered = ORG_UNITS;
    
    // Filter by pillar if not "all"
    if (activeTab !== 'all') {
      filtered = filtered.filter(unit => {
        if (unit.type === 'director') return false;
        if (unit.type === 'pillar') return unit.id === activeTab;
        if (unit.type === 'team') return unit.parentId === activeTab;
        return false;
      });
    }
    
    // Filter teams based on expansion state
    if (activeTab === 'all') {
      filtered = filtered.filter(unit => {
        if (unit.type === 'team') {
          return expandedPillars.has(unit.parentId || '');
        }
        return true;
      });
    }
    
    return filtered;
  }, [activeTab, expandedPillars]);

  // Create nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = visibleUnits.map(unit => {
      const memberCount = unit.members?.length || 0;
      const teamCount = unit.type === 'pillar' 
        ? ORG_UNITS.filter(u => u.type === 'team' && u.parentId === unit.id).length 
        : 0;

      return {
        id: unit.id,
        type: 'group',
        position: { x: 0, y: 0 },
        data: {
          ...unit,
          memberCount,
          teamCount,
          isExpanded: expandedPillars.has(unit.id),
          onToggle: handleToggleExpansion,
        },
        measured: { width: 220, height: 80 },
      };
    });

    const edges: Edge[] = [];
    visibleUnits.forEach(unit => {
      if (unit.parentId) {
        const parentExists = visibleUnits.some(u => u.id === unit.parentId);
        if (parentExists) {
          edges.push({
            id: `${unit.parentId}-${unit.id}`,
            source: unit.parentId,
            target: unit.id,
            type: 'default',
            style: {
              stroke: 'hsl(var(--muted-foreground))',
              strokeWidth: 1,
            },
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [visibleUnits, expandedPillars]);

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges, {
      rankdir: 'TB',
      nodesep: 50,
      ranksep: 90,
    });
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update nodes when layout changes
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Handle pillar expansion/collapse
  function handleToggleExpansion(pillarId: string) {
    setExpandedPillars(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pillarId)) {
        newSet.delete(pillarId);
      } else {
        // Close other pillars if in "all" view
        if (activeTab === 'all') {
          newSet.clear();
        }
        newSet.add(pillarId);
      }
      return newSet;
    });
  }

  // Handle node click
  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
    setIsSheetOpen(true);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) return;
    
    const lowerQuery = query.toLowerCase();
    
    // Search in all units and members
    let foundUnit: OrgUnit | null = null;
    let foundMember: { unit: OrgUnit; member: { name: string; role?: string } } | null = null;
    
    // Search units first
    foundUnit = ORG_UNITS.find(unit => 
      unit.name.toLowerCase().includes(lowerQuery)
    ) || null;
    
    // Search members if no unit found
    if (!foundUnit) {
      for (const unit of ORG_UNITS) {
        if (unit.members) {
          const member = unit.members.find(m => 
            m.name.toLowerCase().includes(lowerQuery) ||
            (m.role && m.role.toLowerCase().includes(lowerQuery))
          );
          if (member) {
            foundMember = { unit, member };
            break;
          }
        }
      }
    }
    
    if (foundUnit) {
      // Focus on the found unit
      const node = nodes.find(n => n.id === foundUnit!.id);
      if (node) {
        setCenter(node.position.x + 110, node.position.y + 40, { zoom: 1, duration: 800 });
        setSelectedNode(foundUnit.id);
        setIsSheetOpen(true);
      }
    } else if (foundMember) {
      // If member found, expand parent team's pillar and focus
      const teamUnit = foundMember.unit;
      
      if (teamUnit.type === 'team' && teamUnit.parentId) {
        // Switch to pillar tab or "all"
        if (activeTab !== 'all' && activeTab !== teamUnit.parentId) {
          setActiveTab(teamUnit.parentId);
        }
        
        // Expand the pillar
        setExpandedPillars(prev => new Set([...prev, teamUnit.parentId!]));
        
        // Focus on team after a brief delay to allow for layout update
        setTimeout(() => {
          const node = nodes.find(n => n.id === teamUnit.id);
          if (node) {
            setCenter(node.position.x + 110, node.position.y + 40, { zoom: 1, duration: 800 });
            setSelectedNode(teamUnit.id);
            setIsSheetOpen(true);
          }
        }, 200);
      }
    }
  }, [nodes, setCenter, activeTab]);

  // Get selected unit for sheet
  const selectedUnit = selectedNode ? ORG_UNITS.find(u => u.id === selectedNode) : null;
  const IconComponent = selectedUnit ? CATEGORY_ICON[selectedUnit.icon] : null;

  // Fit view when tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 600, padding: 0.1 });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, expandedPillars, fitView]);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header with tabs and search */}
      <div className="flex-shrink-0 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="space-y-3">
          <OrgTabs
            pillars={pillars}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, groups, or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
              className="pl-10 h-9"
            />
          </div>
        </div>
      </div>

      {/* React Flow */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          className="bg-background"
          proOptions={{ hideAttribution: true }}
          onInit={() => fitView({ duration: 800, padding: 0.1 })}
        >
          <Background color="hsl(var(--muted-foreground))" size={1} />
          <Controls className="bg-background border border-border" />
          <MiniMap
            className="bg-background border border-border"
            maskColor="hsl(var(--muted) / 0.8)"
            nodeColor="hsl(var(--primary))"
            nodeStrokeWidth={2}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[500px] overflow-y-auto bg-background border-l border-border z-[10000]">
          {selectedUnit && IconComponent && (
            <>
              <SheetHeader className="space-y-3 bg-background pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-left text-foreground">{selectedUnit.name}</SheetTitle>
                    <Badge variant="outline" className="mt-1 bg-background">
                      {selectedUnit.type}
                    </Badge>
                  </div>
                </div>
                {selectedUnit.description && (
                  <p className="text-sm text-muted-foreground text-left bg-muted/30 p-3 rounded-lg">
                    {selectedUnit.description}
                  </p>
                )}
              </SheetHeader>

              {selectedUnit.members && selectedUnit.members.length > 0 && (
                <div className="mt-6 space-y-4 bg-background">
                  <h4 className="font-medium text-sm text-foreground border-b border-border pb-2">
                    Team Members ({selectedUnit.members.length})
                  </h4>
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {selectedUnit.members.map((member, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-medium text-sm text-foreground">
                          {member.name.length > 42 ? `${member.name.substring(0, 39)}...` : member.name}
                        </div>
                        {member.role && (
                          <div className="text-xs text-muted-foreground mt-1 opacity-80">
                            {member.role}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const NeonOrgGraph = () => {
  return (
    <ReactFlowProvider>
      <GraphContent />
    </ReactFlowProvider>
  );
};

export default NeonOrgGraph;
