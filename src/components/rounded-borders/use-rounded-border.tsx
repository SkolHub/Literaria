import { featureCollection, polygon } from '@turf/helpers';
import union from '@turf/union';
import { useCallback, useEffect, useRef } from 'react';

type Point = [number, number];
type Polygon = ReturnType<typeof polygon>;

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface UseRoundedBorderProps {
  minBorderRadius: number;
  borderRadius: number;
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
  fill: string;
  stroke: string;
}

interface UseRoundedBorderResult {
  containerRef: React.RefObject<HTMLDivElement>;
  svgRef: React.RefObject<SVGSVGElement>;
}

function getRecursiveNodes(node: Element, nodes: Element[]) {
  if (node.getAttribute('rounded-border') !== null) {
    nodes.push(node);
  }

  for (const n of node.children) {
    getRecursiveNodes(n, nodes);
  }
}

function getNodes(node: Element): HTMLElement[] {
  const nodes: HTMLElement[] = [];
  getRecursiveNodes(node, nodes);
  return nodes;
}

function getPolygons(
  nodes: HTMLElement[],
  containerRect: DOMRect,
  paddingLeft: number,
  paddingTop: number,
  paddingRight: number,
  paddingBottom: number,
  bounds: Bounds
): Polygon[] {
  const polygons: Polygon[] = [];

  bounds.minX = Infinity;
  bounds.minY = Infinity;
  bounds.maxX = -Infinity;
  bounds.maxY = -Infinity;

  for (const node of nodes) {
    if (node.getAttribute('text-rounded-border') !== null) {
      for (const rect of node.getClientRects()) {
        const left = rect.left - containerRect.left;
        const top = rect.top - containerRect.top;
        const right = left + rect.width;
        const bottom = top + rect.height;

        bounds.minX = Math.min(bounds.minX, left - paddingLeft);
        bounds.minY = Math.min(bounds.minY, top - paddingTop);
        bounds.maxX = Math.max(bounds.maxX, right + paddingRight);
        bounds.maxY = Math.max(bounds.maxY, bottom + paddingBottom);

        polygons.push(
          polygon([
            [
              [left - paddingLeft, top - paddingTop],
              [right + paddingRight, top - paddingTop],
              [right + paddingRight, bottom + paddingBottom],
              [left - paddingLeft, bottom + paddingBottom],
              [left - paddingLeft, top - paddingTop]
            ]
          ])
        );
      }
    } else {
      const rect = node.getBoundingClientRect();
      const left = rect.left - containerRect.left;
      const top = rect.top - containerRect.top;
      const right = left + rect.width;
      const bottom = top + rect.height;

      bounds.minX = Math.min(bounds.minX, left - paddingLeft);
      bounds.minY = Math.min(bounds.minY, top - paddingTop);
      bounds.maxX = Math.max(bounds.maxX, right + paddingRight);
      bounds.maxY = Math.max(bounds.maxY, bottom + paddingBottom);

      polygons.push(
        polygon([
          [
            [left - paddingLeft, top - paddingTop],
            [right + paddingRight, top - paddingTop],
            [right + paddingRight, bottom + paddingBottom],
            [left - paddingLeft, bottom + paddingBottom],
            [left - paddingLeft, top - paddingTop]
          ]
        ])
      );
    }
  }

  return polygons;
}

function getPoints(polygons: Polygon[]): Point[][] {
  if (polygons.length === 0) return [];
  if (polygons.length === 1)
    return polygons[0].geometry.coordinates as Point[][];

  const merged = union(featureCollection(polygons));

  if (!merged) return [];

  if (merged.geometry.type === 'Polygon') {
    return merged.geometry.coordinates as Point[][];
  }

  return merged.geometry.coordinates.flat() as Point[][];
}

function fastDist(A: Point, B: Point): number {
  if (A[0] === B[0]) {
    return Math.abs(A[1] - B[1]);
  }
  return Math.abs(A[0] - B[0]);
}

function orientation(A: Point, B: Point, C: Point): boolean {
  return (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]) > 0;
}

export function useRoundedBorder({
  minBorderRadius,
  borderRadius,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  fill,
  stroke
}: UseRoundedBorderProps): UseRoundedBorderResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const updatePaths = useCallback(() => {
    const container = containerRef.current;
    const svg = svgRef.current;

    if (!container || !svg) return;

    const containerRect = container.getBoundingClientRect();

    // Initialize bounds tracking object
    const bounds: Bounds = {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };

    const nodes = getNodes(container);
    const polygons = getPolygons(
      nodes,
      containerRect,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      bounds
    );

    if (polygons.length === 0) {
      svg.innerHTML = '';
      return;
    }

    // Set SVG size to match content bounds
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;
    svg.style.transform = `translate(${bounds.minX}px, ${bounds.minY}px)`;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const result = getPoints(polygons);
    let content = '';

    for (const pol of result) {
      let path = '';
      let endX: number | undefined;
      let endY: number | undefined;

      pol.push(pol[1]);

      for (let i = 1; i < pol.length - 1; i++) {
        const prev = pol[i - 1];
        const cur = pol[i];
        const next = pol[i + 1];

        const radius = Math.min(
          fastDist(prev, cur) / 2,
          fastDist(cur, next) / 2,
          borderRadius
        );

        if (radius < minBorderRadius) continue;

        // Adjust coordinates relative to bounds
        const x = cur[0] - bounds.minX;
        const y = cur[1] - bounds.minY;

        if (prev[0] === cur[0]) {
          if (cur[1] > prev[1]) {
            path += `L${x} ${y - radius}`;
          } else {
            path += `L${x} ${y + radius}`;
          }
        } else {
          if (cur[0] > prev[0]) {
            path += `L${x - radius} ${y}`;
          } else {
            path += `L${x + radius} ${y}`;
          }
        }

        if (next[0] === cur[0]) {
          endX = x;
          endY = y + (next[1] > cur[1] ? radius : -radius);
        } else {
          endY = y;
          endX = x + (next[0] > cur[0] ? radius : -radius);
        }

        path += `A${radius} ${radius} 0 0 ${+orientation(prev, cur, next)} ${endX} ${endY}`;
      }

      if (typeof endX !== 'undefined' && typeof endY !== 'undefined') {
        content += `<path d="M ${endX} ${endY} ${path}" stroke="${stroke}" fill="${fill}" />`;
      }
    }

    svg.innerHTML = content;
  }, [
    minBorderRadius,
    borderRadius,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    fill,
    stroke
  ]);

  useEffect(() => {
    updatePaths();

    const resizeObserver = new ResizeObserver(updatePaths);
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updatePaths);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updatePaths]);

  // @ts-ignore
  return { containerRef, svgRef };
}
