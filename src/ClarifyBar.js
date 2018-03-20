/**
 * Created by zz on 17/3/13.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
export default class ClarifyBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showUserInput: false,
        }
    }

    render() {
        return (
            <View style={[styles.container, styles.primary]}>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            showUserInput: !this.state.showUserInput,
                        })
                        if (this.props.hideBottomMenu) {
                            this.props.hideBottomMenu();
                        }
                    }}
                    style={[styles.action]}>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        {this.renderButtons()}
                    </View>
                </TouchableOpacity>

                <View style={{flex: 1}}>
                    {this.chooseRender()}
                </View>

            </View>
        )
    }

    renderButtons() {
        if (this.props.renderClarifyStateInput && this.props.renderClarifyStateNormal) {
            return this.state.showUserInput ? this.props.renderClarifyStateInput() : this.props.renderClarifyStateNormal();
        } else {
            return (
                <View style={[styles.wrapper]}>
                    <Text style={[styles.iconText]}>
                        {this.state.showUserInput ? '+' : '-'}
                    </Text>
                </View>
            )
        }
    }

    renderClarifyBar() {

        if (this.props.renderClarifyItems) {
            return this.props.renderClarifyItems();
        }

        return (
            <View style={styles.textContainer}>

                <TouchableOpacity style={styles.text}>
                    <Text >
                        Text1
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.text}>
                    <Text >
                        Text2
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    chooseRender() {
        return this.state.showUserInput ? this.props.inputToolbar : this.renderClarifyBar()
    }

}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
    },
    text: {
        borderLeftWidth: 1,
        borderColor: '#b2b2b2',
        flex: 1,
        alignItems: 'center',
    },
    action: {
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
    container: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#b2b2b2',
        backgroundColor: '#FFFFFF',
    },
    primary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50
    }
});

ClarifyBar.defaultProps = {
    inputToolbar: null,
    renderClarifyStateNormal: null,
    renderClarifyStateInput: null,
    hideBottomMenu: null,
    renderClarifyItems: null,
}

ClarifyBar.propTypes = {
    inputToolbar: PropTypes.object,
    renderClarifyStateNormal: PropTypes.func,
    renderClarifyStateInput: PropTypes.func,
    hideBottomMenu: PropTypes.func,
    renderClarifyItems: PropTypes.func,

}