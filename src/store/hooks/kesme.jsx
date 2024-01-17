import { useState, useCallback } from 'react';
import { useEffect } from "react";

export const useSharedReset = () => {
    const [resetTrigger, setResetTrigger] = useState(false);
    useEffect(() => {
        console.log(`resetTrigger changed: ${resetTrigger}`);
      }, [resetTrigger]);
  
    const triggerReset = useCallback(() => {
      console.log('triggerReset called, setting resetTrigger to true');
      setResetTrigger(true);
    }, []);
  
    const resetCompleted = useCallback(() => {
      console.log('resetCompleted called, setting resetTrigger to false');
      setResetTrigger(false);
    }, []);
  
    return { resetTrigger, triggerReset, resetCompleted };
  };
  
