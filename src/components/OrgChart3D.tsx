import React, { useMemo, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import {
  Search,
  Download,
  FileDown,
  Shield,
  Cloud,
  Users,
  FileText,
  Megaphone,
  Server,
  Globe,
  Crown,
  UserPlus,
  Bot,
} from "lucide-react";
import { ORG_UNITS, OrgUnit, OrgMember, CATEGORY_ICON } from "@/data/orgChart";

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "ig"));
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.toLowerCase() === query.toLowerCase() ? "bg-accent/30 rounded px-0.5" : undefined}>
          {part}
        </span>
      ))}
    </>
  );
};

type MemberCardProps = {
  member: OrgMember;
  query: string;
};

const MemberCard: React.FC<MemberCardProps> = ({ member, query }) => {
  return (
    <div
      className={cn(
        "neon-card relative rounded-lg border bg-card p-3 transition-transform hover:scale-[1.03] hover:shadow-[0_0_28px_hsl(var(--accent)/0.45)]",
        "before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-br before:from-accent/20 before:via-transparent before:to-transparent"
      )}
      aria-label={`${member.name}${member.role ? `, ${member.role}` : ""}`}
    >
      <p className="font-semibold text-sm leading-tight">{highlight(member.name, query)}</p>
      {member.role && (
        <p className="text-xs text-muted-foreground mt-1">{highlight(member.role, query)}</p>
      )}
    </div>
  );
};

const GroupHeader: React.FC<{ group: OrgUnit; count: number }> = ({ group, count }) => {
  const Icon = CATEGORY_ICON[group.icon] ?? Users;
  return (
    <div
      className={cn(
        "group-header flex items-center justify-between gap-4 rounded-md border px-4 py-3",
        "bg-gradient-to-r from-accent/15 via-background to-background"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background shadow-[0_0_12px_hsl(var(--accent)/0.45)]">
          <Icon className="size-4" />
        </span>
        <h3 className="text-base font-semibold leading-none">{group.name}</h3>
      </div>
      <span className="text-xs text-muted-foreground">{count} {count === 1 ? "member" : "members"}</span>
    </div>
  );
};

const Group: React.FC<{
  group: OrgUnit;
  children: OrgUnit[];
  query: string;
  defaultOpen?: boolean;
}> = ({ group, children, query, defaultOpen }) => {
  const members = (group.members ?? []).filter((m) =>
    [m.name, m.role ?? ""].some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );
  
  // Check for matches in this group or its children
  const hasMatches = members.length > 0 || children.some((child) => 
    (child.members ?? []).some((m) => 
      [m.name, m.role ?? ""].join(" ").toLowerCase().includes(query.toLowerCase())
    )
  );

  // Auto-open when searching and matches exist
  const open = query ? hasMatches : defaultOpen;

  return (
    <Collapsible defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <button className="w-full text-left">
          <GroupHeader group={group} count={(group.members ?? []).length} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {group.description && (
          <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
        )}
        {members.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {members.map((m, idx) => (
              <MemberCard key={idx} member={m} query={query} />
            ))}
          </div>
        )}
        {children.length > 0 && (
          <div className="mt-6 space-y-4">
            {children.map((child) => {
              const grandChildren = ORG_UNITS.filter(unit => unit.parentId === child.id);
              return (
                <Group key={child.id} group={child} children={grandChildren} query={query} />
              );
            })}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const OrgChart3D: React.FC = () => {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const flatCount = useMemo(() => ORG_UNITS.reduce((acc, g) => acc + (g.members?.length ?? 0), 0), []);

  // Build hierarchy from flat structure
  const hierarchicalData = useMemo(() => {
    const topLevel = ORG_UNITS.filter(unit => !unit.parentId);
    return topLevel.map(unit => ({
      unit,
      children: ORG_UNITS.filter(child => child.parentId === unit.id)
    }));
  }, []);

  const handleExportPng = async () => {
    if (!containerRef.current) return;
    const dataUrl = await htmlToImage.toPng(containerRef.current, { backgroundColor: "white" });
    const link = document.createElement("a");
    link.download = "genai-org-chart.png";
    link.href = dataUrl;
    link.click();
  };

  const handleExportPdf = async () => {
    if (!containerRef.current) return;
    const dataUrl = await htmlToImage.toPng(containerRef.current, { backgroundColor: "white" });
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
    const { width, height } = pdf.internal.pageSize;
    pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
    pdf.save("genai-org-chart.pdf");
  };

  const dataPending = useMemo(() => ORG_UNITS.every((g) => (g.members?.length ?? 0) === 0), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-md items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or role"
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search org members"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPng} aria-label="Export PNG">
            <Download className="size-4" /> PNG
          </Button>
          <Button variant="outline" onClick={handleExportPdf} aria-label="Export PDF">
            <FileDown className="size-4" /> PDF
          </Button>
        </div>
      </div>

      {dataPending && (
        <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          Content Pending — org chart data will be populated from the uploaded images once verified. I built the full interactive experience; share a text or CSV export of names/roles (or approve OCR) and I’ll load it in instantly.
        </div>
      )}

      <div className="rounded-lg border bg-card p-2 sm:p-4">
        <TransformWrapper
          initialScale={1}
          minScale={0.85}
          maxScale={2.5}
          wheel={{ step: 0.06 }}
          doubleClick={{ disabled: true }}
          pinch={{ step: 5 }}
          centerZoomedOut
          centerOnInit
          limitToBounds
          alignmentAnimation={{ sizeX: 150, sizeY: 150, animationTime: 220 }}
          onInit={(ref) => ref.centerView?.(1)}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="mb-2 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => zoomIn()} aria-label="Zoom in">
                  +
                </Button>
                <Button size="sm" variant="secondary" onClick={() => zoomOut()} aria-label="Zoom out">
                  −
                </Button>
                <Button size="sm" variant="secondary" onClick={() => centerView?.(1)} aria-label="Reset view">
                  Reset
                </Button>
              </div>
              <div className="relative h-[70vh] w-full overflow-hidden rounded-md border">
                <TransformComponent>
                  <div ref={containerRef} className="org-surface min-h-[70vh] w-full p-6">
                    <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {hierarchicalData.map(({ unit, children }) => (
                        <div key={unit.id} className="neon-surface rounded-lg border bg-background/60 p-4 backdrop-blur">
                          <Group group={unit} children={children} query={query} defaultOpen />
                        </div>
                      ))}
                    </div>
                  </div>
                </TransformComponent>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default OrgChart3D;
