import { useCallback } from 'react';

/**
 * Hook to prevent form submission when using editor shortcuts
 * This prevents the form from submitting when Ctrl+B, Ctrl+I, etc. are pressed
 */
export const usePreventFormSubmission = () => {
  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent form submission on common editor shortcuts
    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    
    // Prevent form submission on Enter key when editor might be focused
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    
    return true;
  }, []);

  const handleFormKeyPress = useCallback((e: React.KeyboardEvent) => {
    // Additional prevention for keypress events
    if (e.ctrlKey || e.metaKey) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    
    return true;
  }, []);

  return {
    handleFormKeyDown,
    handleFormKeyPress,
    formProps: {
      onKeyDown: handleFormKeyDown,
      onKeyPress: handleFormKeyPress,
    }
  };
};
