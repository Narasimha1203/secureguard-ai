import { Bell, Bot, History, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import { getBackendModules } from '../../services/api';
import { Badge, NotConnectedBadge } from '../ui/Badge';
import { GlassPanel } from '../ui/GlassPanel';
import type { BackendModule } from '../../types';

const ICONS: Record<BackendModule['id'], ReactNode> = {
  'email-monitoring': <Mail className="h-5 w-5" aria-hidden="true" />,
  'ai-explanations': <Bot className="h-5 w-5" aria-hidden="true" />,
  alerts: <Bell className="h-5 w-5" aria-hidden="true" />,
  history: <History className="h-5 w-5" aria-hidden="true" />,
};

/** Lists backend-dependent features and their honest connection status. */
export function ModuleList() {
  const modules = getBackendModules();
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {modules.map((m) => (
        <li key={m.id}>
          <GlassPanel className="h-full">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-400">{ICONS[m.id]}</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{m.name}</h3>
                  {m.connected ? <Badge tone="green">Connected</Badge> : <NotConnectedBadge />}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{m.description}</p>
              </div>
            </div>
          </GlassPanel>
        </li>
      ))}
    </ul>
  );
}
