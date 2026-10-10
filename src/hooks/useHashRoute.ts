import { useEffect, useState } from 'react';

export type Route = 'home' | 'dashboard' | 'analyzer' | 'report' | 'privacy' | 'not-found';

const VALID: string[] = ['dashboard', 'analyzer', 'report', 'privacy'];

/** Builds the link for a route, e.g. "#/analyzer". Contains no user data. */
export function routeHref(route: Route): string {
  return route === 'home' || route === 'not-found' ? '#/' : `#/${route}`;
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split(/[?#]/)[0].toLowerCase();
  if (raw === '') return 'home';
  return VALID.includes(raw) ? (raw as Route) : 'not-found';
}

/** Minimal hash-based router so beginners need no extra dependency. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
