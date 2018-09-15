// @flow
import * as React from 'react';
import { Work } from '../domain/WeekWork';
import { Grid, withStyles, Paper, Avatar, Typography } from '@material-ui/core';
import withRoot from '../withRoot';
import Log from '../Log';
import moment from 'moment';

const styles = (theme: Object) => ({
  root: {
    textAlign: 'left',
    marginTop: theme.spacing.unit * 3,
    padding: `0 ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: 2
  }
});

type ProvidedProps = {
  classes: Object
}

type Props = {
  classes: Object,
  works: Work[]
}

class Timeline extends React.Component<ProvidedProps & Props> {
  render() {
    const { classes, works } = this.props;
    Log.trace(classes);

    const workItems = works.map(work => {
      return (
        <Paper key={work.id.work}>
          <Grid container spacing={16}>
            <Grid item>
              <Avatar className={classes.avatar} style={{ backgroundColor: work.color }}>
                {work.id.project.substring(0, 3)}
              </Avatar>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography variant="caption">
                {`${moment(work.startTime).format('dddd DD')} : ${moment(work.startTime).format('HH:mm')} - ${moment(
                  work.endTime
                ).format('HH:mm')}`}
              </Typography>
              <Typography noWrap variant="title" gutterBottom>
                {work.label}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      );
    });
    return <div className={classes.root}>{workItems}</div>;
  }
}
export default withRoot(withStyles(styles)(Timeline));
