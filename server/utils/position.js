export const POSITION_GAP = 1000;

export const newPositionBetween = (before, after) => {
  // before/after are numbers or null

  // case 1: empty list
  if (before === null && after === null) return POSITION_GAP;

  // case 2: first place in list
  if (before === null) return after - POSITION_GAP;

  // case 3: last place in list
  if (after === null) return before + POSITION_GAP;

  // case 4: between two components 
  const mid = (before + after) / 2;
  // If too tight, caller should trigger a rebalance
  return mid;
};
