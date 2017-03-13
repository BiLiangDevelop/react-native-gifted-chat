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

export default class RecordAudioBar extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.container}>
                <View style={[styles.text, {height: this.props.composerHeight}]}>
                    <Text >
                        按住说话
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    }
})

RecordAudioBar.defaultProps = {
    composerHeight: Platform.select({
        ios: 33,
        android: 33,
    }),

}