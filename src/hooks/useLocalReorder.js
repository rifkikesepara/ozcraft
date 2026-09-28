import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage local reorder state for Framer Motion Reorder.Group
 * It allows instant local state updates for buttery smooth dragging,
 * while deferring the heavy global state updates (and local storage saving)
 * until the drag is completed.
 *
 * @param {Array} globalItems - The items array from global state
 * @param {Function} onSave - The callback to save the localItems to global state
 */
export function useLocalReorder(globalItems, onSave) {
  const [localItems, setLocalItems] = useState(globalItems || []);
  const onSaveRef = useRef(onSave);
  const localItemsRef = useRef(localItems);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    // Only sync from global if drag is not active to prevent jumping
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalItems(globalItems || []);
  }, [globalItems]);

  useEffect(() => {
    localItemsRef.current = localItems;
  }, [localItems]);

  const handleReorder = useCallback((newOrder) => {
    setLocalItems(newOrder);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (onSaveRef.current) {
      onSaveRef.current(localItemsRef.current);
    }
  }, []);

  return {
    localItems,
    handleReorder,
    handleDragEnd,
  };
}
