import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORY_ICON } from '@/data/orgChart';
import { cn } from '@/lib/utils';

interface GroupNodeProps {
  data: {
    id: string;
    name: string;
    type: 'director' | 'pillar' | 'team';
    icon: keyof typeof CATEGORY_ICON;
    memberCount: number;
    teamCount?: number;
    isExpanded?: boolean;
    onToggle?: (id: string) => void;
    description?: string;
  };
  selected?: boolean;
}

const GroupNode = memo(({ data, selected }: GroupNodeProps) => {
  const IconComponent = CATEGORY_ICON[data.icon];
  const isExpandable = data.type === 'pillar' && (data.teamCount || 0) > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onToggle && isExpandable) {
      data.onToggle(data.id);
    }
  };

  const getNodeStyles = () => {
    switch (data.type) {
      case 'director':
        return 'border-2 border-primary bg-primary/5 shadow-lg';
      case 'pillar':
        return 'border-2 border-muted-foreground bg-muted/20 shadow-md';
      case 'team':
        return 'border border-muted-foreground/50 bg-background shadow-sm';
      default:
        return 'border border-muted-foreground/50 bg-background';
    }
  };

  const getTextStyles = () => {
    switch (data.type) {
      case 'director':
        return 'text-primary font-bold';
      case 'pillar':
        return 'text-foreground font-semibold';
      case 'team':
        return 'text-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={cn(
      'relative min-w-[220px] max-w-[220px] p-3 rounded-lg transition-all duration-200',
      getNodeStyles(),
      selected && 'ring-2 ring-primary ring-offset-2'
    )}>
      {/* Input Handle for teams and pillars */}
      {data.type !== 'director' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 bg-muted-foreground border border-background"
        />
      )}
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          <IconComponent size={16} className={cn(
            data.type === 'director' ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn(
              'text-sm leading-tight truncate',
              getTextStyles()
            )}>
              {data.name.length > 38 ? `${data.name.substring(0, 35)}...` : data.name}
            </h3>
            
            {isExpandable && (
              <button
                onClick={handleToggle}
                className="flex-shrink-0 p-0.5 hover:bg-muted rounded transition-colors"
                aria-label={data.isExpanded ? 'Collapse' : 'Expand'}
              >
                {data.isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {data.teamCount && data.teamCount > 0 && (
              <span>{data.teamCount} teams</span>
            )}
            {data.memberCount > 0 && (
              <span>{data.memberCount} members</span>
            )}
          </div>
          
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Output Handle for directors and pillars */}
      {data.type !== 'team' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 bg-muted-foreground border border-background"
        />
      )}
    </div>
  );
});

GroupNode.displayName = 'GroupNode';

export default GroupNode;