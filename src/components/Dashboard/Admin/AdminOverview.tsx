"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DollarSign, FolderTree, Package, Settings, Users } from "lucide-react";
import { formatPriceBDT } from "@/src/lib/formatCurrency";
import {
  getAdminOrderStats,
  type AdminOrderStats,
  type AdminRevenuePoint,
} from "@/src/lib/api/adminClient";
import { DashboardScope, getScopeBasePath } from "./utils";

type AdminOverviewProps = {
  scope: DashboardScope;
};

type Card = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type PieSegment = {
  label: string;
  value: number;
  color: string;
};

type RevenueMode = "daily" | "monthly" | "yearly";

const PIE_COLORS = ["#0f172a", "#0284c7", "#0d9488"];

const toSafeNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeRevenueSeries = (points?: AdminRevenuePoint[]) => {
  if (!Array.isArray(points)) return [];

  return points
    .map((point) => ({
      label: String(point?.label || "-"),
      revenue: toSafeNumber(point?.revenue),
    }))
    .filter((point) => point.label.trim().length > 0);
};

const formatCompact = (value: number) => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const formatTimeLabel = (rawLabel: string, mode: RevenueMode, variant: "short" | "full" = "short") => {
  if (mode === "yearly") {
    return rawLabel;
  }

  if (mode === "monthly") {
    const [year, month] = rawLabel.split("-").map(Number);
    if (!year || !month) return rawLabel;

    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: variant === "short" ? "short" : "long",
    });
  }

  const date = new Date(rawLabel);
  if (Number.isNaN(date.getTime())) {
    return rawLabel;
  }

  return date.toLocaleDateString("en-US", {
    year: variant === "full" ? "numeric" : undefined,
    month: variant === "short" ? "short" : "long",
    day: "numeric",
  });
};

const PieDistributionChart = ({ segments }: { segments: PieSegment[] }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const arcs = useMemo(() => {
    if (total <= 0) {
      return [] as Array<PieSegment & { percent: number; start: number }>;
    }

    let running = 0;
    return segments.map((segment) => {
      const percent = (segment.value / total) * 100;
      const arc = { ...segment, percent, start: running };
      running += percent;
      return arc;
    });
  }, [segments, total]);

  return (
    <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative">
        <div className="mb-5 text-center">
          <h3 className="text-base font-bold text-slate-900">Platform Distribution</h3>
          <p className="mt-1 text-sm text-slate-500">Users, products and orders composition</p>
        </div>

        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
          <div className="relative grid h-36 w-36 place-content-center rounded-full bg-white/80 ring-1 ring-slate-200">
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
              {arcs.map((arc) => {
                const dash = (arc.percent / 100) * circumference;
                const offset = -((arc.start / 100) * circumference);

                return (
                  <circle
                    key={arc.label}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeDashoffset={offset}
                  />
                );
              })}
            </svg>
            <div className="relative text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{formatCompact(total)}</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-sm text-slate-700 md:min-w-[220px]">
            {segments.map((segment) => {
              const pct = total > 0 ? ((segment.value / total) * 100).toFixed(1) : "0.0";

              return (
                <li key={segment.label} className="flex items-center gap-2.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="font-medium text-slate-900">{segment.label}</span>
                  <span className="text-slate-500">{formatCompact(segment.value)} ({pct}%)</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
};

const RevenueMarketChart = ({
  title,
  mode,
  points,
  lineColor,
}: {
  title: string;
  mode: RevenueMode;
  points: { label: string; revenue: number }[];
  lineColor: string;
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);


  const chart = useMemo(() => {
    if (points.length === 0) {
      return null;
    }

    const width = 360;
    const height = 180;
    const padding = { top: 12, right: 10, bottom: 24, left: 10 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const values = points.map((point) => point.revenue);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const coords = points.map((point, index) => {
      const x =
        points.length > 1
          ? padding.left + (index / (points.length - 1)) * innerWidth
          : padding.left + innerWidth / 2;
      const y = padding.top + ((max - point.revenue) / range) * innerHeight;

      return {
        x,
        y,
        value: point.revenue,
        rawLabel: point.label,
        shortLabel: formatTimeLabel(point.label, mode, "short"),
        fullLabel: formatTimeLabel(point.label, mode, "full"),
      };
    });

    const linePath = coords
      .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x.toFixed(2)} ${coord.y.toFixed(2)}`)
      .join(" ");

    const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(2)} ${(height - padding.bottom).toFixed(2)} L ${coords[0].x.toFixed(2)} ${(height - padding.bottom).toFixed(2)} Z`;

    const zones = coords.map((coord, index) => {
      const left = index === 0 ? padding.left : (coords[index - 1].x + coord.x) / 2;
      const right = index === coords.length - 1 ? width - padding.right : (coord.x + coords[index + 1].x) / 2;

      return {
        x: left,
        width: right - left,
        index,
      };
    });

    const first = points[0].revenue;
    const last = points[points.length - 1].revenue;
    const delta = last - first;
    const deltaPct = first > 0 ? (delta / first) * 100 : 0;

    const axisTickStep = Math.max(1, Math.ceil(coords.length / 6));
    const axisTicks = coords.filter((_, index) => index % axisTickStep === 0 || index === coords.length - 1);

    return {
      width,
      height,
      padding,
      min,
      max,
      first,
      last,
      delta,
      deltaPct,
      linePath,
      areaPath,
      coords,
      zones,
      gradientId: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-area`,
      gridYs: [0, 1, 2, 3].map((step) => padding.top + (innerHeight / 3) * step),
      axisTicks,
    };
  }, [mode, points, title]);

  if (!chart) {
    return (
      <article className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-4 text-sm text-slate-500">No revenue data available.</p>
      </article>
    );
  }

  const safeActiveIndex = activeIndex >= 0 && activeIndex < chart.coords.length ? activeIndex : chart.coords.length - 1;
  const activePoint = chart.coords[safeActiveIndex];
  const isUp = chart.delta >= 0;

  const tooltipWidth = 126;
  const tooltipX = Math.min(
    Math.max(activePoint.x - tooltipWidth / 2, chart.padding.left),
    chart.width - chart.padding.right - tooltipWidth,
  );
  const tooltipY = Math.max(activePoint.y - 54, chart.padding.top + 2);

  return (
    <article className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-800">{activePoint.fullLabel}</p>
          <p className="text-sm text-slate-600">{formatPriceBDT(activePoint.value)}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {isUp ? "+" : ""}
          {chart.deltaPct.toFixed(1)}%
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-linear-to-b from-slate-50 to-white p-3">
        <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-44 w-full">
          <defs>
            <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {chart.gridYs.map((y, index) => (
            <line
              key={`${title}-grid-${index}`}
              x1={chart.padding.left}
              y1={y}
              x2={chart.width - chart.padding.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {chart.zones.map((zone) => (
            <rect
              key={`${title}-zone-${zone.index}`}
              x={zone.x}
              y={chart.padding.top}
              width={zone.width}
              height={chart.height - chart.padding.top - chart.padding.bottom}
              fill="transparent"
              onMouseMove={() => setActiveIndex(zone.index)}
              onMouseEnter={() => setActiveIndex(zone.index)}
            />
          ))}

          <path d={chart.areaPath} fill={`url(#${chart.gradientId})`} />
          <path d={chart.linePath} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" />

          <line
            x1={activePoint.x}
            y1={chart.padding.top}
            x2={activePoint.x}
            y2={chart.height - chart.padding.bottom}
            stroke={lineColor}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {chart.coords.map((coord, index) => (
            <circle
              key={`${title}-dot-${coord.rawLabel}-${index}`}
              cx={coord.x}
              cy={coord.y}
              r={index === safeActiveIndex ? 4.5 : 2.5}
              fill={lineColor}
              opacity={index === safeActiveIndex ? 1 : 0.6}
            />
          ))}

          <g>
            <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="40" rx="8" fill="#0f172a" opacity="0.95" />
            <text x={tooltipX + 8} y={tooltipY + 16} fill="#cbd5e1" fontSize="10">
              {activePoint.fullLabel}
            </text>
            <text x={tooltipX + 8} y={tooltipY + 31} fill="#ffffff" fontSize="11" fontWeight="700">
              {formatPriceBDT(activePoint.value)}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
        {chart.axisTicks.map((tick) => (
          <span key={`${title}-tick-${tick.rawLabel}`} className="rounded-full bg-slate-100 px-2 py-0.5">
            {tick.shortLabel}
          </span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs">
        <div>
          <p className="text-slate-500">Low</p>
          <p className="font-semibold text-slate-900">{formatPriceBDT(chart.min)}</p>
        </div>
        <div>
          <p className="text-slate-500">High</p>
          <p className="font-semibold text-slate-900">{formatPriceBDT(chart.max)}</p>
        </div>
        <div>
          <p className="text-slate-500">Change</p>
          <p className={`font-semibold ${isUp ? "text-emerald-700" : "text-rose-700"}`}>
            {isUp ? "+" : ""}
            {formatPriceBDT(chart.delta)}
          </p>
        </div>
      </div>
    </article>
  );
};

export default function AdminOverview({ scope }: AdminOverviewProps) {
  const [stats, setStats] = useState<AdminOrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  const basePath = getScopeBasePath(scope);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const payload = await getAdminOrderStats();
        if (!mounted) return;

        setStats(payload || null);
      } catch {
        if (!mounted) return;
        setStats(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const overview = stats?.overview;

  const cards = useMemo<Card[]>(() => {
    const core: Card[] = [
      {
        id: "users",
        label: "Total Users",
        value: String(toSafeNumber(overview?.totalUsers)),
        href: `${basePath}/users`,
        icon: Users,
      },
      {
        id: "products",
        label: "Total Products",
        value: String(toSafeNumber(overview?.totalProducts)),
        href: `${basePath}/products`,
        icon: Package,
      },
      {
        id: "orders",
        label: "Total Orders",
        value: String(toSafeNumber(overview?.totalOrders)),
        href: `${basePath}/orders`,
        icon: Package,
      },
      {
        id: "revenue",
        label: "Total Revenue",
        value: formatPriceBDT(toSafeNumber(overview?.totalRevenue)),
        href: `${basePath}/orders`,
        icon: DollarSign,
      },
    ];

    if (scope === "SUPER_ADMIN") {
      core.push({ id: "settings", label: "Web Settings", value: "Control", href: `${basePath}/web-settings`, icon: Settings });
    }

    return core;
  }, [basePath, overview?.totalOrders, overview?.totalProducts, overview?.totalRevenue, overview?.totalUsers, scope]);

  const pieSegments = useMemo<PieSegment[]>(() => {
    return [
      { label: "Users", value: toSafeNumber(overview?.totalUsers), color: PIE_COLORS[0] },
      { label: "Products", value: toSafeNumber(overview?.totalProducts), color: PIE_COLORS[1] },
      { label: "Orders", value: toSafeNumber(overview?.totalOrders), color: PIE_COLORS[2] },
    ];
  }, [overview?.totalOrders, overview?.totalProducts, overview?.totalUsers]);

  const dailyRevenue = useMemo(() => normalizeRevenueSeries(stats?.charts?.dailyRevenue), [stats?.charts?.dailyRevenue]);
  const monthlyRevenue = useMemo(() => normalizeRevenueSeries(stats?.charts?.monthlyRevenue), [stats?.charts?.monthlyRevenue]);
  const yearlyRevenue = useMemo(() => normalizeRevenueSeries(stats?.charts?.yearlyRevenue), [stats?.charts?.yearlyRevenue]);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-slate-100 transition group-hover:bg-sky-100" />
              <div className="relative flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <span className="rounded-lg bg-slate-900/90 p-2 text-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="relative mt-3 text-2xl font-bold text-slate-900">{loading ? "..." : item.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href={`${basePath}/products`}
          className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Product Control</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Manage all products</h3>
              <p className="mt-2 text-sm text-slate-600">Add products, update details, change status, or delete items.</p>
            </div>
            <span className="rounded-xl bg-primary p-3 text-white">
              <Package className="h-5 w-5" />
            </span>
          </div>
        </Link>

        <Link
          href={`${basePath}/categories`}
          className="rounded-2xl border border-primary/15 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Category Control</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Manage all categories</h3>
              <p className="mt-2 text-sm text-slate-600">Create categories, update naming, and control active or inactive state.</p>
            </div>
            <span className="rounded-xl bg-primary p-3 text-white">
              <FolderTree className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </div>

      <PieDistributionChart segments={pieSegments} />

      <div className="grid grid-cols-1 gap-5">
        <RevenueMarketChart title="Daily Revenue" mode="daily" points={dailyRevenue} lineColor="#1d4ed8" />
        <RevenueMarketChart title="Monthly Revenue" mode="monthly" points={monthlyRevenue} lineColor="#0f766e" />
        <RevenueMarketChart title="Yearly Revenue" mode="yearly" points={yearlyRevenue} lineColor="#c2410c" />
      </div>
    </section>
  );
}


