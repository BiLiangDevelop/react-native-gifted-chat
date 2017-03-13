/**
 * Created by zz on 17/3/13.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';

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
                    }}
                    style={[styles.action]}>

                    <View style={[styles.wrapper]}>
                        <Text style={[styles.iconText]}>
                            {this.state.showUserInput ? '+' : '-'}
                        </Text>
                    </View>

                </TouchableOpacity>

                <View style={{flex: 1}}>
                    {this.chooseRender()}
                </View>

            </View>
        )
    }

    renderClarifyBar() {
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
        flex: 1
    },
    text: {
        borderLeftWidth: 1,
        borderColor: '#b2b2b2',
        flex: 1,
        alignItems: 'center',
    },
    action: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginRight: 10,
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
        height: 41
    }
});

ClarifyBar.defaultProps = {
    inputToolbar: null,
}

ClarifyBar.propTypes = {
    inputToolbar: React.PropTypes.object,
}