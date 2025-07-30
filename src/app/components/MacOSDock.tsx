import { memo, useCallback } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

interface MacOSDockProps {
  onCustomizeClick: () => void;
  onCSRClick?: () => void;
}

const MacOSDock = memo(({ onCustomizeClick, onCSRClick }: MacOSDockProps) => {
  const handleCustomizeClick = useCallback(() => {
    onCustomizeClick();
  }, [onCustomizeClick]);

  const handleCSRClick = useCallback(() => {
    if (onCSRClick) {
      onCSRClick();
    }
  }, [onCSRClick]);

  return (
    <div className="macos-dock">
      <div className="dock-content">
        <div className="dock-item active dock-item-0" title="CS RIPPERS" onClick={handleCSRClick}>
          <div className="dock-icon">
            <OptimizedImage 
              src="/images/CSR-logo.svg" 
              alt="CS RIPPERS" 
              className="dock-logo"
              width={48}
              height={48}
              priority
            />
          </div>
        </div>
        <div className="dock-item dock-item-1" title="Dashboard">
          <Link href="/dashboard">
            <div className="dock-icon">
              <OptimizedImage 
                src="/images/icons/dashboard.svg" 
                alt="Dashboard" 
                className="dock-icon-img"
                width={32}
                height={32}
              />
            </div>
          </Link>
        </div>
        <div className="dock-item dock-item-2" title="Competitions">
          <div className="dock-icon">
            <OptimizedImage 
              src="/images/icons/competition.svg" 
              alt="Competitions" 
              className="dock-icon-img"
              width={32}
              height={32}
            />
          </div>
        </div>
        <div className="dock-item dock-item-3" title="Tasks">
          <div className="dock-icon">
            <OptimizedImage 
              src="/images/icons/tasks.svg" 
              alt="Tasks" 
              className="dock-icon-img"
              width={32}
              height={32}
            />
          </div>
        </div>
        <div className="dock-separator"></div>
        <div className="dock-item dock-item-4" title="Profile">
          <Link href="/login">
            <div className="dock-icon">
              <OptimizedImage 
                src="/images/icons/profile.svg" 
                alt="Profile" 
                className="dock-icon-img"
                width={32}
                height={32}
              />
            </div>
          </Link>
        </div>
        <div className="dock-item dock-item-5" title="Settings">
          <div className="dock-icon">
            <OptimizedImage 
              src="/images/icons/settings.svg" 
              alt="Settings" 
              className="dock-icon-img"
              width={32}
              height={32}
            />
          </div>
        </div>
        <div className="dock-separator"></div>
        <div className="dock-item dock-item-6" title="Customize" onClick={handleCustomizeClick}>
          <div className="dock-icon">
            <OptimizedImage 
              src="/images/icons/pencil.svg" 
              alt="Customize" 
              className="dock-icon-img"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

MacOSDock.displayName = 'MacOSDock';

export default MacOSDock;