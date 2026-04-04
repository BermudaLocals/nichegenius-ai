'use client';

import {
  useState,
  useEffect,
  useCallback,
  Suspense,
  type ReactNode,
} from 'react';
import { decode, reassemble, type ContentFragment } from '@/lib/security/obfuscate';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DynamicSection {
  id: string;
  endpoint?: string;           // API endpoint to fetch from
  encodedContent?: string;     // Pre-encoded static content (base64+rot13)
  fragments?: ContentFragment[]; // Fragmented content for reassembly
  fallback?: ReactNode;        // Custom loading fallback
  className?: string;
  renderAs?: 'html' | 'text' | 'json';
}

interface DynamicLoaderProps {
  sections: DynamicSection[];
  loadDelay?: number;          // Stagger loading (ms between sections)
  className?: string;
}

interface DynamicContentProps {
  section: DynamicSection;
  delay?: number;
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse space-y-3 ${className || ''}`}
      aria-label="Loading content..."
    >
      <div className="h-4 bg-white/5 rounded-lg w-3/4" />
      <div className="h-4 bg-white/5 rounded-lg w-1/2" />
      <div className="h-4 bg-white/5 rounded-lg w-5/6" />
    </div>
  );
}

// ─── Verification: ensure we're running in a live environment ────────────────
function isLiveEnvironment(): boolean {
  if (typeof window === 'undefined') return true; // SSR is fine
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return (
    protocol === 'https:' ||
    protocol === 'http:' && (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.local')
    )
  );
}

// ─── Dynamic Content Component ───────────────────────────────────────────────
function DynamicContent({ section, delay = 0 }: DynamicContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const loadContent = useCallback(async () => {
    // Don't load if saved as static file
    if (!isLiveEnvironment()) {
      setError(true);
      return;
    }

    // Apply staggered loading delay
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      let result: string;

      if (section.endpoint) {
        // Fetch from API with anti-cache headers
        const response = await fetch(section.endpoint, {
          headers: {
            'X-Dynamic-Load': '1',
            'X-Request-Time': Date.now().toString(),
            'Cache-Control': 'no-cache, no-store',
          },
          cache: 'no-store',
        });

        if (!response.ok) throw new Error('Fetch failed');

        const data = await response.text();
        // Decode the response (server sends encoded content)
        try {
          result = decode(data);
        } catch {
          result = data; // Fallback: use raw if not encoded
        }
      } else if (section.fragments && section.fragments.length > 0) {
        // Reassemble from fragments
        result = reassemble(section.fragments);
      } else if (section.encodedContent) {
        // Decode static encoded content
        result = decode(section.encodedContent);
      } else {
        throw new Error('No content source specified');
      }

      setContent(result);
      setIsLoaded(true);
    } catch (err) {
      console.warn(`[DynamicLoader] Failed to load section ${section.id}:`, err);
      setError(true);
    }
  }, [section, delay]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Error state — shown when saved as static file
  if (error) {
    return (
      <div
        className={`text-center py-8 text-zinc-600 ${section.className || ''}`}
        data-section={section.id}
      >
        <p className="text-sm">Content requires a live connection.</p>
      </div>
    );
  }

  // Loading state — this is what cloners see forever
  if (!isLoaded || content === null) {
    return (
      <div data-section={section.id} className={section.className}>
        {section.fallback || <LoadingSkeleton className={section.className} />}
      </div>
    );
  }

  // Render loaded content
  if (section.renderAs === 'html') {
    return (
      <div
        data-section={section.id}
        className={section.className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (section.renderAs === 'json') {
    try {
      const data = JSON.parse(content);
      return (
        <div data-section={section.id} className={section.className}>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return (
        <div data-section={section.id} className={section.className}>
          {content}
        </div>
      );
    }
  }

  // Default: render as text
  return (
    <div
      data-section={section.id}
      className={section.className}
      data-protected
    >
      {content}
    </div>
  );
}

// ─── Main Dynamic Loader Component ───────────────────────────────────────────
export function DynamicLoader({
  sections,
  loadDelay = 150,
  className,
}: DynamicLoaderProps) {
  return (
    <div className={className}>
      {sections.map((section, index) => (
        <Suspense
          key={section.id}
          fallback={
            section.fallback || (
              <LoadingSkeleton className={section.className} />
            )
          }
        >
          <DynamicContent
            section={section}
            delay={index * loadDelay}
          />
        </Suspense>
      ))}
    </div>
  );
}

// ─── Convenience: Single Section Loader ──────────────────────────────────────
export function DynamicSection({
  id,
  endpoint,
  encodedContent,
  fragments,
  fallback,
  className,
  renderAs = 'text',
}: DynamicSection) {
  const section: DynamicSection = {
    id,
    endpoint,
    encodedContent,
    fragments,
    fallback,
    className,
    renderAs,
  };

  return (
    <Suspense fallback={fallback || <LoadingSkeleton className={className} />}>
      <DynamicContent section={section} />
    </Suspense>
  );
}

// ─── Hook: Use Dynamic Content ───────────────────────────────────────────────
export function useDynamicContent(endpoint: string) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveEnvironment()) {
      setError('Content requires a live connection');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'X-Dynamic-Load': '1',
        'Cache-Control': 'no-cache, no-store',
      },
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        try {
          setData(decode(text));
        } catch {
          setData(text);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [endpoint]);

  return { data, loading, error };
}

export default DynamicLoader;
