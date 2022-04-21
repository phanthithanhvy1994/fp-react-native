import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import LoadingOverlay from 'react-loading-overlay';
// import BounceLoader from 'react-spinners/BounceLoader';
export const Loading = () => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    <LoadingOverlay
      active={promiseInProgress}
      spinner
      // Specify classNamePrefix '_loading_overlay_overlay' => Loading_overlay
      classNamePrefix="Loading_"
      // Custom overlay css (extending base styles)
      styles={{
        overlay: base => ({
          ...base,
          position: 'fixed',
        }),
      }}
    />
  );
};
