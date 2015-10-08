import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';
import styles from './HomeRoute.css';
import * as counterActions from '../../actions/counterActions';

function mapStateToProps(state) {
  return {
    counter: state.app.counter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...counterActions,
  }, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
@cssModules(styles)
export default class HomeRoute extends React.Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired,
  };

  render() {
    return (
      <div styleName="container">
        <i
          onClick={this.props.increment}
          className="fa fa-home" />
        <span>{this.props.counter}</span>
      </div>
    );
  }
}
