import { Home } from 'lucide-react';
import { LinkButton } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { StateBlock } from '../components/ui/StateBlock';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <GlassPanel>
        <StateBlock
          kind="error"
          title="Page not found"
          description="That address does not match any page. Use the menu or go back to the start."
          action={
            <LinkButton route="home" icon={<Home className="h-4 w-4" aria-hidden="true" />}>
              Back to home
            </LinkButton>
          }
        />
      </GlassPanel>
    </div>
  );
}
