import React from 'react';
import {
    StyleSheet,
    View,
    ViewPropTypes,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Composer from './Composer';
import Send from './Send';
import ActionsRight from './ActionsRight';
import RecordAudioBar from './RecordAudioBar'
import IconButton from './IconButton'

export default class InputToolbar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {inputAudio: false}
    }

    renderActions() {

        if (this.props.renderAudioButton && this.props.renderKeyboardButton) {
            return this.state.inputAudio ? this.props.renderKeyboardButton() : this.props.renderAudioButton();
        } else {
            return (
                <IconButton
                    onIconClick={() => {
                        this.setState({
                            inputAudio: !this.state.inputAudio,
                        })
                    }}
                    textIcon={this.state.inputAudio ? '+' : '-'}/>
            )
        }
    }

    renderActionsRight() {
        if (this.props.renderActionsRight) {
            return this.props.renderActionsRight(this.props);
        } else if (this.props.onPressActionRightButton) {
            return <ActionsRight {...this.props} />;
        }
        return null;
    }

    renderSend() {

        if (this.props.text.trim().length > 0) {
            if (this.props.renderSend) {
                return this.props.renderSend(this.props);
            } else {
                return <Send {...this.props}/>;
            }

        } else {
            return this.renderActionsRight();
        }

    }

    renderComposer() {
        if (this.props.renderComposer) {
            return this.props.renderComposer(this.props);
        }

        return (
            <Composer
                {...this.props}
            />
        );
    }

    renderAudioBar() {
        return (
            <RecordAudioBar
                renderHoldToTalkButton={this.props.renderHoldToTalkButton}
            />
        )
    }

    renderContentBar() {
        return this.state.inputAudio ? this.renderAudioBar() : this.renderComposer();
    }

    renderAccessory() {
        if (this.props.renderAccessory) {
            return (
                <View style={[styles.accessory, this.props.accessoryStyle]}>
                    {this.props.renderAccessory(this.props)}
                </View>
            );
        }
        return null;
    }

    renderSnapChatBtn() {
        if (this.props.renderSnapChatBtn) {
            return this.props.renderSnapChatBtn();
        }
        return null;
    }

    render() {
        return (
            <View
                style={[styles.container, this.props.containerStyle, {borderTopWidth: this.props.showBorderTop ? StyleSheet.hairlineWidth : 0}]}>
                <View style={[styles.primary, this.props.primaryStyle]}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            inputAudio: !this.state.inputAudio,
                        })
                        if (this.props.hideBottomMenu) {
                            this.props.hideBottomMenu();
                        }
                    }}>
                        {this.renderActions()}
                    </TouchableOpacity>
                    {this.renderContentBar()}
                    {this.renderSnapChatBtn()}
                    {this.renderSend()}
                </View>
                {this.renderAccessory()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopColor: '#b2b2b2',
        backgroundColor: '#FFFFFF',
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accessory: {
        height: 50,
    },
});

InputToolbar.defaultProps = {
    renderAccessory: null,
    renderActions: null,
    renderActionsRight: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    showBorderTop: true,
    renderAudioButton: null,
    renderKeyboardButton: null,
    renderMenuButton: null,
    renderHoldToTalkButton: null,
    hideBottomMenu: null,
    renderSnapChatBtn: null,
};

InputToolbar.propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderActionsRight: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    onPressActionRightButton: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    primaryStyle: ViewPropTypes.style,
    accessoryStyle: ViewPropTypes.style,
    showBorderTop: PropTypes.bool,
    renderAudioButton: PropTypes.func,
    renderKeyboardButton: PropTypes.func,
    renderMenuButton: PropTypes.func,
    renderHoldToTalkButton: PropTypes.func,
    hideBottomMenu: PropTypes.func,
    renderSnapChatBtn: PropTypes.func,
};
