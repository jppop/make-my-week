// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Select from 'react-select';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core';
import { ProjectManager } from '../domain/WeekWork';
import Log from '../Log';

const ITEM_HEIGHT = 48;

const styles = (theme: Object) => ({
  root: {
    flexGrow: 1,
    fontSize: theme.typography.body1.fontSize
  },
  scrollContainer: {},
  scroll: {
    position: 'relative',
    width: '230%',
    backgroundColor: theme.palette.background.paper,
    height: '230%'
  },
  popper: {
    zIndex: theme.zIndex.snackbar,
    marginBottom: theme.spacing.unit * 3
  },
  content: {
    width: 300,
    height: 400,
    overflow: 'auto'
  },
  list: {
    textAlign: 'left'
  }
});

type ProvidedProps = {
  classes: Object
}
type Props = {
  classes: Object,
  projectManager: ProjectManager
}
type State = {
  open: boolean,
  anchorEl: Object | null
}
type OptionType = {
  [string]: any
}

type OptionsType = Array<OptionType>

type GroupType = {
  options: OptionsType,
  [string]: any
}

class TaskSearch extends React.Component<ProvidedProps & Props, State> {
  state: State = {
    open: false,
    anchorEl: null
  }
  options: Array<GroupType>
  anchorEl: ?any

  constructor(props: ProvidedProps & Props) {
    super(props);

    const options = props.projectManager.projects.map(p => {
      const taskOptions = p.tasks.map(t => {
        return { value: t.id, label: t.label };
      });
      const options = {
        label: p.id,
        options: taskOptions
      };
      return options;
    });
    this.options = options;
    Log.trace(options, 'TaskSearch::constructor');
  }
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  }

  handleClose = event => {
    if (this.anchorEl && this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;
    const { anchorEl, open } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.scrollContainer}>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            Toggle Menu Grow
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal className={classes.popper}>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper className={classes.content}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <Select options={this.options} isClearable isSearchable className={classes.list} />
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <Dialog open={false} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth="xs">
          <DialogContent>
            <DialogContentText>Add a work on Monday, at 10:00</DialogContentText>
            <Select options={this.options} isClearable isSearchable />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" size="small">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary" size="small">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(TaskSearch);
