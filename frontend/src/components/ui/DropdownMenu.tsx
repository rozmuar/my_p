import { useState, useRef, useEffect, ReactNode, Children } from 'react';
import { createPortal } from 'react-dom';

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  side?: 'bottom' | 'top';
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu = ({ 
  trigger, 
  children, 
  align = 'right', 
  side = 'bottom',
  className = '',
  onOpenChange 
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 192; // Approximate width
    const menuHeight = 200; // Approximate height
    
    let top = triggerRect.bottom + window.scrollY + 4;
    let left = triggerRect.right + window.scrollX;

    // Adjust for side
    if (side === 'top') {
      top = triggerRect.top + window.scrollY - menuHeight - 4;
    }

    // Adjust for align
    if (align === 'left') {
      left = triggerRect.left + window.scrollX;
    } else if (align === 'center') {
      left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (menuWidth / 2);
    } else {
      left = triggerRect.right + window.scrollX - menuWidth;
    }

    // Keep menu on screen
    const padding = 8;
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }
    
    if (top + menuHeight > window.innerHeight + window.scrollY) {
      top = triggerRect.top + window.scrollY - menuHeight - 4;
    }
    
    setPosition({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, align, side]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        menuRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && position && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            zIndex: 9999,
          }}
          className={`
            bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-48 max-w-80
            animate-in fade-in-0 zoom-in-95 duration-100
            ${className}
          `}
          onClick={() => {
            setIsOpen(false);
            onOpenChange?.(false);
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
};

// Subcomponents for easier usage
interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  disabled = false,
  className = ''
}: DropdownMenuItemProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled && onClick) {
        onClick();
      }
    }}
    disabled={disabled}
    className={`
      w-full text-left px-3 py-2 text-sm transition-colors
      ${disabled 
        ? 'text-gray-400 cursor-not-allowed' 
        : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

interface DropdownMenuSeparatorProps {
  className?: string;
}

export const DropdownMenuSeparator = ({ className = '' }: DropdownMenuSeparatorProps) => (
  <div className={`h-px bg-gray-200 my-1 ${className}`} />
);

interface DropdownMenuLabelProps {
  children: ReactNode;
  className?: string;
}

export const DropdownMenuLabel = ({ children, className = '' }: DropdownMenuLabelProps) => (
  <div className={`px-3 py-2 text-xs font-medium text-gray-500 ${className}`}>
    {children}
  </div>
);