// @flow
import * as React from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { Work } from '../domain/WeekWork';
import moment from 'moment';
import withRoot from '../withRoot';
import { withStyles, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme: Object) => ({
  root: {
    textAlign: 'left',
    marginTop: theme.spacing.unit * 3,
    padding: `0 ${theme.spacing.unit * 3}px`,
    maxWidth: 700,
    overflow: 'auto',
    maxHeight: 700,
    zIndex: theme.zIndex.appBar,
    position: 'relative',
    flexGrow: 1
  },
  timeline: {
    zIndex: theme.zIndex.appBar
  },
  actionButton: {
    height: 20,
    width: 20,
    zIndex: theme.zIndex.appBar
  },
  actionIcon: {
    height: 16,
    width: 16,
    zIndex: theme.zIndex.appBar
  },
  workDetail: {}
});

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  works: Work[]
}

function ActionsIcons(props) {
  const { classes, keyBase } = props;
  return [
    <Tooltip key={keyBase + '-action-edit'} title="Edit work">
      <IconButton
        classes={{
          root: classes.actionButton
        }}
        color="secondary"
        // size="small"
        aria-label="Edit work"
      >
        <EditIcon className={classes.actionIcon} />
      </IconButton>
    </Tooltip>,
    <Tooltip key={keyBase + '-action-delete'} title="Delete work">
      <IconButton
        classes={{
          root: classes.actionButton
        }}
        color="secondary"
        size="small"
        aria-label="Delete work"
      >
        <DeleteIcon className={classes.actionIcon} />
      </IconButton>
    </Tooltip>
  ];
}

const WorkDetails = props => {
  const { classes } = props; // eslint-disable-line react/prop-types
  return (
    <Grid container className={classes.workDetail} spacing={0}>
      <Grid item xs={12}>
        <Typography component="p">any comment here</Typography>
      </Grid>
    </Grid>
  );
};

const timelineInfo = (work: Work): string => {
  const day = moment(work.startTime).format('dddd DD MMM');
  const start = moment(work.startTime).format('HH:mm');
  const end = moment(work.endTime).format('HH:mm');
  const duration = work.duration(true);
  const hour = Math.trunc(duration);
  const minutes = (duration - hour) * 60;
  const durationAsString = hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  return `${day}, ${start} - ${end} (${durationAsString})`;
};

class WorkTimeline extends React.Component<ProvidedProps & Props> {
  render() {
    const { classes, works } = this.props;

    const workItems = works.map(work => {
      return (
        <TimelineEvent
          key={work.id.work}
          title={work.label}
          createdAt={timelineInfo(work)}
          icon={<Icon>donut_large</Icon>}
          iconColor="darkgrey"
          buttons={<ActionsIcons classes={classes} keyBase={work.id.work} />}
          bubbleStyle={{ backgroundColor: work.color }}
        >
          <WorkDetails work={work} classes={classes} />
        </TimelineEvent>
      );
    });
    return (
      <div className={classes.root}>
        <Timeline className={classes.timeline}>{workItems}</Timeline>
      </div>
    );
  }
}
export default withRoot(withStyles(styles)(WorkTimeline));