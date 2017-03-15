/**
 * Created by zz on 17/3/13.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class IconButton extends React.Component {
    render() {
        return (
            <View
                style={styles.action}>
                <View
                    style={styles.wrapper}
                >
                    <Text
                        style={styles.iconText}
                    >
                        {this.props.textIcon}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1
    },
    action: {
        width: 26,
        height: 26,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
})

IconButton.defaultProps = {
    icon: null,
    textIcon: '',
    onIconClick: null,
}

IconButton.propTypes = {
    icon: React.PropTypes.string,
    textIcon: React.PropTypes.string,
    onIconClick: React.PropTypes.func,
}