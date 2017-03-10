import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
import ActionsRight from './ActionsRight';

export default class InputToolbar extends React.Component {
    renderActions() {
        if (this.props.renderActions) {
            return this.props.renderActions(this.props);
        } else if (this.props.onPressActionButton) {
            return <Actions {...this.props} />;
        }
        return null;
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
        if (this.props.renderSend) {
            return this.props.renderSend(this.props);
        }
        if(this.props.text.trim().length>0){
            return <Send {...this.props}/>;
        }else{
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

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={[styles.primary, this.props.primaryStyle]}>
                    {this.renderActions()}
                    {this.renderComposer()}
                    {this.renderSend()}
                </View>
                {this.renderAccessory()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: '#FFFFFF',
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    accessory: {
        height: 44,
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
};

InputToolbar.propTypes = {
    renderAccessory: React.PropTypes.func,
    renderActions: React.PropTypes.func,
    renderActionsRight: React.PropTypes.func,
    renderSend: React.PropTypes.func,
    renderComposer: React.PropTypes.func,
    onPressActionButton: React.PropTypes.func,
    onPressActionRightButton: React.PropTypes.func,
    containerStyle: View.propTypes.style,
    primaryStyle: View.propTypes.style,
    accessoryStyle: View.propTypes.style,
};
