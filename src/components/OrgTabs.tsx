import { memo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrgTabsProps {
  pillars: Array<{ id: string; name: string }>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const OrgTabs = memo(({ pillars, activeTab, onTabChange }: OrgTabsProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="h-9 bg-muted/50 p-1 w-fit min-w-full">
          <TabsTrigger 
            value="all" 
            className="text-xs px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            All
          </TabsTrigger>
          {pillars.map((pillar) => (
            <TabsTrigger
              key={pillar.id}
              value={pillar.id}
              className="text-xs px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {pillar.name.length > 20 ? `${pillar.name.substring(0, 17)}...` : pillar.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
});

OrgTabs.displayName = 'OrgTabs';

export default OrgTabs;