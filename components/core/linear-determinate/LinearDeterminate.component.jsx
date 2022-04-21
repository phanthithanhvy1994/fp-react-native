import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { usePromiseTracker } from 'react-promise-tracker';
import useStyles from './LinearDeterminate';

function LinearDeterminate() {
  const classes = useStyles();
  const { promiseInProgress } = usePromiseTracker();

  const [completed, setCompleted] = React.useState(0);

  React.useEffect(() => {
    function progress() {
      setCompleted(oldCompleted => {
        if (promiseInProgress) {
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldCompleted + diff, 100);
      });
    }

    const timer = setInterval(progress, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.container} hidden={!promiseInProgress}>
      <LinearProgress
        classes={{
          root: classes.linearProgress,
          barColorSecondary: classes.barColorSecondary,
          colorSecondary: classes.colorSecondary,
        }}
        value={completed}
        variant="determinate"
        color="secondary"
      />
    </div>
  );
}

export default LinearDeterminate;
