import { Suspense, lazy } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ErrorBoundary } from '../ErrorBoundary';
import { GlobeFallback } from './GlobeFallback';

// The 3D scene is loaded on demand so the rest of the page appears faster.
const HoloGlobe = lazy(() => import('./HoloGlobe'));

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

/**
 * Wrapper that handles reduced motion, missing WebGL and loading/error states.
 * The globe is a decorative visualization. It does NOT show real threat data.
 */
export function GlobePanel() {
  const reducedMotion = useReducedMotion();
  const canRender3D = webglAvailable();

  return (
    <figure className="mx-auto w-full max-w-[560px]">
      <div
        className="relative aspect-square w-full"
        role="img"
        aria-label="Decorative holographic globe with orbiting nodes and connecting lines. Illustration only, not live data."
      >
        <div aria-hidden="true" className="absolute inset-6 rounded-full bg-neon-violet/10 blur-3xl" />
        <div className="relative h-full w-full">
          {canRender3D ? (
            <ErrorBoundary fallback={<GlobeFallback />}>
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm text-slate-400" role="status">
                    Loading 3D globe...
                  </div>
                }
              >
                <HoloGlobe animate={!reducedMotion} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <GlobeFallback />
          )}
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Illustration only. The nodes and links are decorative and do not show real threats or traffic.
        {reducedMotion ? ' Animation is paused because your device requests reduced motion.' : ''}
      </figcaption>
    </figure>
  );
}
