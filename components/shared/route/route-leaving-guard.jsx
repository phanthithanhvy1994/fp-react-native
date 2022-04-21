import React from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, Action } from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import { buttonConstant } from '../../../util/constant';

const confirmDialog = (content, action, cancelAction) => {
  openDialog({
    title: Message.CONFIRM,
    content,
    type: dialogConstant.type.CONFIRM,
    actions: [
      {
        name: Action.cancel,
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.CANCEL,
        action: cancelAction
      },
      {
        name: Action.ok,
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
        action,
      }
    ],
  });
};

class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  }

  showModal = location => this.setState({
    modalVisible: true,
    lastLocation: location,
  })

  closeModal = callback => this.setState({
    modalVisible: false
  }, callback)

  onCancel = () => this.closeModal(() => {});

  handleBlockedNavigation = nextLocation => {
    const { confirmedNavigation } = this.state;
    const { shouldBlockNavigation } = this.props;
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation);
      return false;
    }

    return true;
  }

  handleConfirmNavigationClick = () =>
    this.closeModal(() => {
      const { navigate } = this.props;
      const { lastLocation } = this.state;

      if (lastLocation) {
        this.setState({
          confirmedNavigation: true
        }, () => navigate(lastLocation.pathname));
      }
    })

  render() {
    const { when } = this.props;
    const { modalVisible } = this.state;
    return (
      <>
        <Prompt
          when={when}
          message={this.handleBlockedNavigation}/>
        {modalVisible &&
        setTimeout(() => 
          confirmDialog(
            Message.REDIRECT_WITHOUT_SAVING,
            () => this.handleConfirmNavigationClick(),
            () => this.onCancel()
          )
        )}
      </>
    );
  }
}

RouteLeavingGuard.propTypes = {
  when: PropTypes.any,
  navigate: PropTypes.any,
  shouldBlockNavigation: PropTypes.any,
};

export default RouteLeavingGuard;
