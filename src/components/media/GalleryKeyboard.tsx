import React, { useEffect } from 'react';

interface GalleryKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const GalleryKeyboard: React.FC<GalleryKeyboardProps> = ({
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Hide all page content except the modal to prevent any bleeding
      document.body.classList.add('gallery-modal-open');

      // Prevent navigation when gallery is open
      const preventNavigation = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      // Prevent all navigation links from working when gallery is open
      const navigationLinks = document.querySelectorAll('a[href^="#"]');
      navigationLinks.forEach(link => {
        link.addEventListener('click', preventNavigation, true);
      });

      const keyHandler = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            onClose();
            break;
          case 'ArrowLeft':
            if (hasPrev) onPrev();
            break;
          case 'ArrowRight':
            if (hasNext) onNext();
            break;
        }
      };

      // Focus management for accessibility
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      // Store the previously focused element
      const previouslyFocusedElement = document.activeElement as HTMLElement;

      // Focus the first focusable element in the modal
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }

      // Trap focus within the modal
      const trapFocus = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', keyHandler);
      document.addEventListener('keydown', trapFocus);
      document.body.style.overflow = 'hidden';

      return () => {
        // Remove gallery modal class and restore page content
        document.body.classList.remove('gallery-modal-open');

        // Remove navigation prevention
        navigationLinks.forEach(link => {
          link.removeEventListener('click', preventNavigation, true);
        });

        document.removeEventListener('keydown', keyHandler);
        document.removeEventListener('keydown', trapFocus);
        document.body.style.overflow = 'unset';
        // Restore focus to previously focused element
        previouslyFocusedElement?.focus();
      };
    }
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  return null; // This component only handles side effects
};

export default GalleryKeyboard;
