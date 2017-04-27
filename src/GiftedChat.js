import React from 'react';
import {
    Animated,
    InteractionManager,
    Platform,
    StyleSheet,
    View,
    Keyboard
} from 'react-native';

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'

import ActionSheet from '@exponent/react-native-action-sheet';
import moment from 'moment/min/moment-with-locales.min';
import uuid from 'uuid';

import * as utils from './utils';
import Actions from './Actions';
import Avatar from './Avatar';
import Bubble from './Bubble';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import Composer from './Composer';
import Day from './Day';
import InputToolbar from './InputToolbar';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import MessageContainer from './MessageContainer';
import Send from './Send';
import Time from './Time';
import GiftedAvatar from './GiftedAvatar';
import ActionsRight from './ActionsRight';
import ClarifyBar from './ClarifyBar'
import IconButton from './IconButton'


// Min and max heights of ToolbarInput and Composer
// Needed for Composer auto grow and ScrollView animation
// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
    ios: 39,
    android: 47,
});
const MAX_COMPOSER_HEIGHT = Platform.select({
    ios: 39,
    android: 47,
});
const MIN_INPUT_TOOLBAR_HEIGHT = 50;

var DEFAULT_EMOJI_HEIGHT = Platform.select({
    ios: 250 / 2,
    android: 277 / 2,
});
;

var bottomMenuShowing = false;

class GiftedChat extends React.Component {
    constructor(props) {
        super(props);

        // default values
        this._isMounted = false;
        this._keyboardHeight = 0;
        this._bottomOffset = 0;
        this._maxHeight = null;
        this._isFirstLayout = true;
        this._locale = 'en';
        this._messages = [];
        this.show = false;
        this.hideOnShowingMenu = false;

        this.state = {
            isInitialized: false, // initialization will calculate maxHeight before rendering the chat
            composerHeight: MIN_COMPOSER_HEIGHT,
            messagesContainerHeight: new Animated.Value(0),
            typingDisabled: false,
            showCustomMenu: false,
        };

        this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
        this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
        this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
        this.onSend = this.onSend.bind(this);
        this.getLocale = this.getLocale.bind(this);
        this.onInputSizeChanged = this.onInputSizeChanged.bind(this);
        this.onInputTextChanged = this.onInputTextChanged.bind(this);
        this.onMainViewLayout = this.onMainViewLayout.bind(this);
        this.onInitialLayoutViewLayout = this.onInitialLayoutViewLayout.bind(this);
        this.renderInputToolbar = this.renderInputToolbar.bind(this)
        this.onShowSnapChat = this.onShowSnapChat.bind(this);


        this.invertibleScrollViewProps = {
            inverted: true,
            keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
            onKeyboardWillShow: this.onKeyboardWillShow,
            onKeyboardWillHide: this.onKeyboardWillHide,
            onKeyboardDidShow: this.onKeyboardDidShow,
            onKeyboardDidHide: this.onKeyboardDidHide,
        };
    }

    changeCustomMenu() {
        const newMessagesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT)))
            - this.getKeyboardHeight() + this.getBottomOffset() - (this.show ? this.props.snapChatSlideBarHeight : 0);
        let menuCurrentVisible = this.state.showCustomMenu;
        this.setState({
            showCustomMenu: true,
            messagesContainerHeight: this.getKeyboardHeight() === 0 ? newMessagesContainerHeight - this.props.customMenuHeight : this.state.messagesContainerHeight,
            typingDisabled: false
        });
        if (this.getKeyboardHeight() > 0) {
            if (Keyboard.dismiss) {
                Keyboard.dismiss();
            } else {
                dismissKeyboard();
            }
        } else {
            if (menuCurrentVisible) {
                if (this.textInput) {
                    this.textInput.focus();
                } else {
                    this.hideCustomMenu();
                }

            }

        }
        bottomMenuShowing = true;
    }

    hideCustomMenu() {
        this.setState({
            showCustomMenu: false,
            messagesContainerHeight: this.state.showCustomMenu ?
                this.state.messagesContainerHeight + this.props.customMenuHeight
                : this.state.messagesContainerHeight
        });
        bottomMenuShowing = false;
        this.hideOnShowingMenu = false;
    }

    static append(currentMessages = [], messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        return messages.concat(currentMessages);
    }

    static prepend(currentMessages = [], messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        return currentMessages.concat(messages);
    }

    getChildContext() {
        return {
            actionSheet: () => this._actionSheetRef,
            getLocale: this.getLocale,
        };
    }

    componentWillMount() {
        this.setIsMounted(true);
        this.initLocale();
        this.initMessages(this.props.messages);
    }

    componentWillUnmount() {
        this.setIsMounted(false);
    }

    componentWillReceiveProps(nextProps = {}) {
        this.initMessages(nextProps.messages);
    }

    initLocale() {
        if (this.props.locale === null || moment.locales().indexOf(this.props.locale) === -1) {
            this.setLocale('en');
        } else {
            this.setLocale(this.props.locale);
        }
    }

    initMessages(messages = []) {
        this.setMessages(messages);
    }

    setLocale(locale) {
        this._locale = locale;
    }

    getLocale() {
        return this._locale;
    }

    setMessages(messages) {
        this._messages = messages;
    }

    getMessages() {
        return this._messages;
    }

    setMaxHeight(height) {
        this._maxHeight = height;
    }

    getMaxHeight() {
        return this._maxHeight;
    }

    setKeyboardHeight(height) {
        this._keyboardHeight = height;
    }

    getKeyboardHeight() {
        return this._keyboardHeight;
    }

    setBottomOffset(value) {
        this._bottomOffset = value;
    }

    getBottomOffset() {
        return this._bottomOffset;
    }

    setIsFirstLayout(value) {
        this._isFirstLayout = value;
    }

    getIsFirstLayout() {
        return this._isFirstLayout;
    }

    setIsTypingDisabled(value) {
        this.setState({
            typingDisabled: value
        });
    }

    getIsTypingDisabled() {
        return this.state.typingDisabled;
    }

    setIsMounted(value) {
        this._isMounted = value;
    }

    getIsMounted() {
        return this._isMounted;
    }

    // TODO
    // setMinInputToolbarHeight
    getMinInputToolbarHeight() {
        if (this.props.renderAccessory) {
            return MIN_INPUT_TOOLBAR_HEIGHT * 2;
        }
        return MIN_INPUT_TOOLBAR_HEIGHT;
    }

    prepareMessagesContainerHeight(value) {
        if (this.props.isAnimated === true) {
            return new Animated.Value(value);
        }
        return value;
    }

    onKeyboardWillShow(e) {
        // this.setState({
        //     showCustomMenu: false,
        //     messagesContainerHeight: this.state.showCustomMenu ? this.state.messagesContainerHeight + this.props.customMenuHeight : this.state.messagesContainerHeight
        // });
        this.setIsTypingDisabled(true);
        this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
        //打开后可跟键盘高度一样高
        // DEFAULT_EMOJI_HEIGHT = this.getKeyboardHeight();
        this.setBottomOffset(this.props.bottomOffset);
        const newMessagesContainerHeight = (this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this.getKeyboardHeight() + this.getBottomOffset() - (this.show ? this.props.snapChatSlideBarHeight : 0);
        // if (this.props.isAnimated === true) {
        //     Animated.timing(this.state.messagesContainerHeight, {
        //         toValue: newMessagesContainerHeight,
        //         duration: 210,
        //     }).start();
        // } else {

        this.setState({
            showCustomMenu: false,
            messagesContainerHeight: newMessagesContainerHeight,
        });
        // }
    }

    onShowSnapChat(show) {
        if (this.show === show)
            return;
        this.show = show;
        let normalHeight = this.prepareMessagesContainerHeight(this.props.hideInputBar ? this.getMaxHeight() : this.getMaxHeight() - this.getMinInputToolbarHeight() - (this.show ? this.props.snapChatSlideBarHeight : 0))
        if (show) {
            this.setState({
                messagesContainerHeight: normalHeight,
            });
        } else {
            this.setState({
                messagesContainerHeight: this.state.messagesContainerHeight + this.props.snapChatSlideBarHeight,
            });
        }
    }

    onKeyboardWillHide() {
        this.setIsTypingDisabled(true);
        this.setKeyboardHeight(0);
        this.setBottomOffset(0);
        const newMessagesContainerHeight = this.getMaxHeight() - (this.state.composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT)
            + (this.show ? this.props.snapChatSlideBarHeight : 0));
        // if (this.props.isAnimated === true) {
        //     Animated.timing(this.state.messagesContainerHeight, {
        //         toValue: newMessagesContainerHeight,
        //         duration: 210,
        //     }).start();
        // } else {
        let height = this.state.showCustomMenu ? newMessagesContainerHeight - this.props.customMenuHeight : newMessagesContainerHeight;
        this.setState({
            messagesContainerHeight: height,
        });
        // }
    }

    onKeyboardDidShow(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillShow(e);
        }
        this.setIsTypingDisabled(false);
    }

    onKeyboardDidHide(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillHide(e);
        }
        this.setIsTypingDisabled(false);
    }

    scrollToBottom(animated = true) {
        this._messageContainerRef.scrollTo({
            y: 0,
            animated,
        });
    }

    renderMessages() {
        const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
        return (
            <AnimatedView style={{
                height: this.state.messagesContainerHeight,
            }}>
                <MessageContainer
                    {...this.props}

                    invertibleScrollViewProps={this.invertibleScrollViewProps}

                    messages={this.getMessages()}

                    ref={component => this._messageContainerRef = component}
                    pressContainer={this.hideCustomMenu.bind(this)}
                    handleTouch={bottomMenuShowing}
                />
                {this.renderChatFooter()}
            </AnimatedView>
        );
    }

    onSend(messages = [], shouldResetInputToolbar = false) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        messages = messages.map((message) => {
            return {
                ...message,
                user: this.props.user,
                createdAt: new Date(),
                _id: this.props.messageIdGenerator(),
            };
        });

        if (shouldResetInputToolbar === true) {
            this.setIsTypingDisabled(true);
            this.resetInputToolbar();
        }

        this.props.onSend(messages);
        this.scrollToBottom();

        if (shouldResetInputToolbar === true) {
            setTimeout(() => {
                if (this.getIsMounted() === true) {
                    this.setIsTypingDisabled(false);
                }
            }, 100);
        }
    }

    resetInputToolbar() {
        if (this.textInput) {
            this.textInput.clear();
        }
        this.setState({
            text: '',
            composerHeight: MIN_COMPOSER_HEIGHT,
            messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - this.getKeyboardHeight() + this.props.bottomOffset - (this.show ? this.props.snapChatSlideBarHeight : 0)),
        });
    }

    calculateInputToolbarHeight(newComposerHeight) {
        return newComposerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
    }

    onInputSizeChanged(size) {
        const newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, size.height));
        const newMessagesContainerHeight = this.getMaxHeight() - this.calculateInputToolbarHeight(newComposerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
        this.setState({
            composerHeight: newComposerHeight,
            messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight - (this.show ? this.props.snapChatSlideBarHeight : 0)),
        });
    }

    onInputTextChanged(text) {
        if (this.getIsTypingDisabled()) {
            return;
        }
        if (this.props.onInputTextChanged) {
            this.props.onInputTextChanged(text);
        }
        this.setState({text});
    }

    onInitialLayoutViewLayout(e) {
        const layout = e.nativeEvent.layout;
        if (layout.height <= 0) {
            return;
        }
        this.setMaxHeight(layout.height);
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isInitialized: true,
                text: '',
                composerHeight: MIN_COMPOSER_HEIGHT,
                messagesContainerHeight: this.prepareMessagesContainerHeight(this.props.hideInputBar ? this.getMaxHeight() : this.getMaxHeight() - this.getMinInputToolbarHeight() - (this.show ? this.props.snapChatSlideBarHeight : 0)),
            });
        });
    }

    onMainViewLayout(e) {
        if (Platform.OS === 'android') {
            // fix an issue when keyboard is dismissing during the initialization
            const layout = e.nativeEvent.layout;
            if ((this.getMaxHeight() !== layout.height && this.getIsFirstLayout() === true)) {
                this.setMaxHeight(layout.height);
                this.setState({
                    messagesContainerHeight: this.prepareMessagesContainerHeight(this.getMaxHeight() - this.getMinInputToolbarHeight() - emojiHeight - (this.show ? this.props.snapChatSlideBarHeight : 0)),
                });
            }
        }
        if (this.getIsFirstLayout() === true) {
            this.setIsFirstLayout(false);
        }
    }

    renderInputToolbar() {
        const inputToolbarProps = {
            ...this.props,
            text: this.state.text,
            composerHeight: Math.min(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
            onSend: this.onSend,
            onInputSizeChanged: this.onInputSizeChanged,
            onTextChanged: this.onInputTextChanged,
            textInputProps: {
                ...this.props.textInputProps,
                ref: textInput => this.textInput = textInput,
                maxLength: this.getIsTypingDisabled() ? 0 : null
            },
            showBorderTop: !this.props.isFromClarify,
        };
        if (this.getIsTypingDisabled()) {
            inputToolbarProps.textInputProps.maxLength = 0;
        }
        if (this.props.renderInputToolbar) {
            return this.props.renderInputToolbar(inputToolbarProps);
        }
        return (
            <InputToolbar
                {...inputToolbarProps}
                hideBottomMenu={this.hideCustomMenu.bind(this)}
            />
        );
    }

    renderChatFooter() {
        if (this.props.renderChatFooter) {
            const footerProps = {
                ...this.props,
            };
            return this.props.renderChatFooter(footerProps);
        }
        return null;
    }

    renderLoading() {
        if (this.props.renderLoading) {
            return this.props.renderLoading();
        }
        return null;
    }

    renderEmoji() {
        return this.state.showCustomMenu
            ? (this.props.renderCustomMenu ? this.props.renderCustomMenu(this.props) : null)
            : null;
    }

    renderBottomBar() {
        return this.props.isFromClarify
            ? (<ClarifyBar
                {...this.props}
                hideBottomMenu={this.hideCustomMenu.bind(this)}
                inputToolbar={this.renderInputToolbar()}/>)
            : this.renderInputToolbar()
    }

    render() {
        if (this.state.isInitialized === true) {
            return (
                <ActionSheet ref={component => this._actionSheetRef = component}>
                    <View style={styles.container} onLayout={this.onMainViewLayout}>
                        {this.renderMessages()}
                        {this.show ? this.props.renderSnapChatSlideBar() : null}
                        {this.props.hideInputBar ? null : this.renderBottomBar()}
                        {this.renderEmoji()}
                    </View>
                </ActionSheet>

            );
        }
        return (
            <View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
                {this.renderLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

GiftedChat.childContextTypes = {
    actionSheet: React.PropTypes.func,
    getLocale: React.PropTypes.func,
};

GiftedChat.defaultProps = {
    messages: [],
    onSend: () => {
    },
    loadEarlier: false,
    onLoadEarlier: () => {
    },
    locale: null,
    isAnimated: Platform.select({
        ios: true,
        android: false,
    }),
    keyboardShouldPersistTaps: false,
    renderAccessory: null,
    renderActions: null,
    renderActionsRight: null,
    renderAvatar: null,
    renderBubble: null,
    renderFooter: null,
    renderChatFooter: null,
    renderMessageText: null,
    renderMessageImage: null,
    renderComposer: null,
    renderCustomView: null,
    renderDay: null,
    renderInputToolbar: null,
    renderLoadEarlier: null,
    renderLoading: null,
    renderMessage: null,
    renderSend: null,
    renderTime: null,
    user: {},
    bottomOffset: 0,
    isLoadingEarlier: false,
    messageIdGenerator: () => uuid.v4(),
    isFromClarify: false,
    renderCustomMenu: null,
    renderHoldToTalkButton: null,
    renderAudioButton: null,
    renderKeyboardButton: null,
    renderMenuButton: null,
    renderClarifyStateNormal: null,
    renderClarifyStateInput: null,
    renderClarifyItems: null,
    customMenuHeight: DEFAULT_EMOJI_HEIGHT,
    initialListSize: 10,
    pageSize: 10,
    hideInputBar: false,
    renderSnapChatBtn: null,
    renderSnapChatSlideBar: null,
    snapChatSlideBarHeight: 50,
    snapChatModel: false,
    onChangeVisibleRows: null,
}
;

GiftedChat.propTypes = {
    messages: React.PropTypes.array,
    onSend: React.PropTypes.func,
    onInputTextChanged: React.PropTypes.func,
    loadEarlier: React.PropTypes.bool,
    onLoadEarlier: React.PropTypes.func,
    locale: React.PropTypes.string,
    isAnimated: React.PropTypes.bool,
    renderAccessory: React.PropTypes.func,
    renderActions: React.PropTypes.func,
    renderActionsRight: React.PropTypes.func,
    renderAvatar: React.PropTypes.func,
    renderBubble: React.PropTypes.func,
    renderFooter: React.PropTypes.func,
    renderChatFooter: React.PropTypes.func,
    renderMessageText: React.PropTypes.func,
    renderMessageImage: React.PropTypes.func,
    renderComposer: React.PropTypes.func,
    renderCustomView: React.PropTypes.func,
    renderDay: React.PropTypes.func,
    renderInputToolbar: React.PropTypes.func,
    renderLoadEarlier: React.PropTypes.func,
    renderLoading: React.PropTypes.func,
    renderMessage: React.PropTypes.func,
    renderSend: React.PropTypes.func,
    renderTime: React.PropTypes.func,
    user: React.PropTypes.object,
    bottomOffset: React.PropTypes.number,
    isLoadingEarlier: React.PropTypes.bool,
    messageIdGenerator: React.PropTypes.func,
    keyboardShouldPersistTaps: React.PropTypes.oneOf(['always', 'never', 'handled']),
    isFromClarify: React.PropTypes.bool,//是否从澄清界面过来
    renderCustomMenu: React.PropTypes.func,//底部自定义菜单
    renderHoldToTalkButton: React.PropTypes.func,//按住说话
    renderAudioButton: React.PropTypes.func,//语音按钮
    renderKeyboardButton: React.PropTypes.func,//键盘按钮
    renderMenuButton: React.PropTypes.func,//右边的菜单加号按钮
    renderClarifyStateNormal: React.PropTypes.func,//澄清界面底部bar左边按钮，默认状态
    renderClarifyStateInput: React.PropTypes.func,//澄清界面底部bar左边按钮，切换为输入框时状态
    renderClarifyItems: React.PropTypes.func,//澄清界面底部bar的动态按钮项
    customMenuHeight: React.PropTypes.number,//自定义菜单高度
    initialListSize: React.PropTypes.number,//聊天内容初始化列表Size
    pageSize: React.PropTypes.number,//每页Size
    hideInputBar: React.PropTypes.bool,//是否隐藏底部输入bar
    snapChatModel: React.PropTypes.bool,
    renderSnapChatBtn: React.PropTypes.func,//渲染snapChat 按钮
    renderSnapChatSlideBar: React.PropTypes.func,
    onChangeVisibleRows: React.PropTypes.func,
    snapChatSlideBarHeight: React.PropTypes.number,
};

export {
    GiftedChat,
    Actions,
    Avatar,
    Bubble,
    MessageImage,
    MessageText,
    Composer,
    Day,
    InputToolbar,
    LoadEarlier,
    Message,
    Send,
    Time,
    GiftedAvatar,
    utils,
    ActionsRight,
    ClarifyBar,
    IconButton
};
