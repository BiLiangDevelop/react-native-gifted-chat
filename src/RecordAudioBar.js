/**
 * Created by zz on 17/3/13.
 */
import React from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import PropTypes from 'prop-types';
export default class RecordAudioBar extends React.Component {
    render() {
        return (
            <TouchableOpacity style={[styles.container]}>
                <View style={[{height: this.props.composerHeight}]}>
                    {this.renderHoldToTalk()}
                </View>
            </TouchableOpacity>
        )
    }

    renderHoldToTalk() {
        if (this.props.renderHoldToTalkButton) {
            return this.props.renderHoldToTalkButton();
        } else {
            return (
                <Text style={styles.text}>
                    按住说话
                </Text>
            )
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 3,
        marginTop: Platform.select({
            ios: 6,
            android: 6,
        }),
        marginBottom: Platform.select({
            ios: 6,
            android: 6,
        }),
        alignSelf: 'center',
        flex: 1
    }
})

RecordAudioBar.defaultProps = {
    composerHeight: 44,
    renderHoldToTalkButton: null,

}

RecordAudioBar.propTypes = {
    renderHoldToTalkButton: PropTypes.func,
}