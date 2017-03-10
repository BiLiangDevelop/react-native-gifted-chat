import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default class ActionsRight extends React.Component {
    constructor(props) {
        super(props);
        this.onPressActionRightButton = this.onPressActionRightButton.bind(this);
    }

    onPressActionRightButton() {
        const options = Object.keys(this.props.options);
        const cancelButtonIndex = Object.keys(this.props.options).length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex,
                tintColor: this.props.optionTintColor
            },
            (buttonIndex) => {
                let i = 0;
                for (let key in this.props.options) {
                    if (this.props.options.hasOwnProperty(key)) {
                        if (buttonIndex === i) {
                            this.props.options[key](this.props);
                            return;
                        }
                        i++;
                    }
                }
            });
    }

    renderIcon() {
        if (this.props.icon) {
            return this.props.icon();
        }
        return (
            <View
                style={[styles.wrapper, this.props.wrapperStyle]}
            >
                <Text
                    style={[styles.iconText, this.props.iconTextStyle]}
                >
                    +
                </Text>
            </View>
        );
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.container, this.props.containerStyle]}
                onPress={this.props.onPressActionRightButton || this.onPressActionRightButton}
            >
                {this.renderIcon()}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

ActionsRight.contextTypes = {
    actionSheet: React.PropTypes.func,
};

ActionsRight.defaultProps = {
    onSend: () => {
    },
    options: {},
    optionTintColor: '#007AFF',
    icon: null,
    containerStyle: {},
    iconTextStyle: {},
};

ActionsRight.propTypes = {
    onSend: React.PropTypes.func,
    options: React.PropTypes.object,
    optionTintColor: React.PropTypes.string,
    icon: React.PropTypes.func,
    onPressActionRightButton: React.PropTypes.func,
    containerStyle: View.propTypes.style,
    iconTextStyle: Text.propTypes.style,
};
