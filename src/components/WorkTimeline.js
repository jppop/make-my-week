// @flow
import * as React from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { Work } from '../domain/WeekWork';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const styles = (theme: Object) => ({
  root: {
    textAlign: 'left',
    marginTop: theme.spacing.unit * 3,
    padding: `0 ${theme.spacing.unit * 3}px`,
    position: 'relative',
    flexGrow: 1
  },
  scrollContainer: {
    position: 'relative',
    overflow: 'auto',
    maxWidth: 700,
    height: 400
  },
  scroll: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  timeline: {},
  actionButton: {
    height: 20,
    width: 20
  },
  actionIcon: {
    height: 16,
    width: 16
  },
  workDetail: {}
});

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  works: Work[],
  onDelete: (work: Work) => void,
  startDay: Date,
  endDay: Date
}

function ActionsIcons(props) {
  const { classes, keyBase, deleteActionHandler } = props;
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
        style={{ marginRight: 5 }}
        color="secondary"
        size="small"
        aria-label="Delete work"
        onClick={deleteActionHandler}
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
    const { classes, works, onDelete, startDay, endDay } = this.props;

    const didWork = works.length > 0;
    const workItems = works.map(work => {
      return (
        <TimelineEvent
          key={work.id.work}
          title={work.label}
          createdAt={timelineInfo(work)}
          icon={<Icon>donut_large</Icon>}
          iconColor="darkgrey"
          buttons={<ActionsIcons classes={classes} keyBase={work.id.work} deleteActionHandler={() => onDelete(work)} />}
          bubbleStyle={{ backgroundColor: work.color }}
        >
          <WorkDetails work={work} classes={classes} />
        </TimelineEvent>
      );
    });
    const subheader = `${moment(startDay).format('dddd DD MMM')} - ${moment(endDay).format('dddd DD MMM')}`;
    return (
      <div className={classes.root}>
        <Card>
          <CardHeader title="My Work" subheader={subheader} />
          <CardContent className={classes.scrollContainer}>
            {didWork ? (
              <Timeline className={classes.scroll}>{workItems}</Timeline>
            ) : (
              <Typography variant="body1">You did&apos;nt work too much this week</Typography>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}
export default withStyles(styles)(WorkTimeline);
