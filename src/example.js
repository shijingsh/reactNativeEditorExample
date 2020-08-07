import React, {Component} from 'react';
import {
    Appearance,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-editor';
import ImagePicker from 'react-native-customized-image-picker';
import Util from './common/utils';

const initHTML = `<br/>
<center><b>Pell.js Rich Editor</b></center>
<center>React Native</center>
<br/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" ></br></br>
</br></br>
`;

export default class RichTextExample extends Component {

    constructor(props) {
        super(props);
        const that = this;
        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = that.createContentStyle(theme);
        that.state = {theme: theme, contentStyle};
    }

    pickForUpload = () => {
        let _this = this;

        ImagePicker.openPicker({
            isCamera: true,
            compressQuality: 90,
        }).then(images => {
            _this.richText.appendContentHTML('<p>openPicker:' + JSON.stringify(images) + '</p>');
            if (images && images.length) {
                let userImages = images.map(i => {
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
                });
                if(userImages&&userImages.length>0){
                    Util.multiPost(url,userImages,[],function (bean) {
                        _this.richText.appendContentHTML('<p>successCallback:' + JSON.stringify(uploadImages) + '</p>');
                    },function (err) {
                        _this.richText.appendContentHTML('<p>failCallback:' + JSON.stringify(error) + '</p>');
                    })
                }
            }
        }).catch(e => {
            _this.richText.appendContentHTML('<p>openPicker catch:' + JSON.stringify(e) + '</p>');
        });
    };

    createContentStyle(theme) {
        const contentStyle = {backgroundColor: '#000033', color: '#fff', placeholderColor: 'gray'};
        if (theme === 'light') {
            contentStyle.backgroundColor = '#fff';
            contentStyle.color = '#000033';
            contentStyle.placeholderColor = '#a9a9a9';
        }
        return contentStyle;
    }

    onHome = () => {
        let {navigation} = this.props;
        navigation.push('index');
    };

    render() {
        let that = this;
        const {contentStyle, theme} = that.state;
        const {backgroundColor, color, placeholderColor} = contentStyle;
        const themeBg = {backgroundColor};
        let action = ['image'];
        return (
            <SafeAreaView style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#847b66',
                }}>
                    <TouchableOpacity style={{marginLeft: 10, padding: 5}} onPress={this.onHome}>
                        <Text>back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginLeft: 10, padding: 5}} onPress={() => that.pickForUpload()}>
                        <Text>upload</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={[styles.scroll, themeBg]} keyboardDismissMode={'none'}>
                    <RichEditor
                        editorStyle={contentStyle}
                        containerStyle={themeBg}
                        ref={(r) => that.richText = r}
                        style={[styles.rich, themeBg]}
                        placeholder={'please input content'}
                        initialContentHTML={initHTML}
                    />
                </ScrollView>
                <KeyboardAvoidingView behavior={'padding'}>
                    <RichToolbar
                        style={[styles.richBar, themeBg]}
                        getEditor={() => that.richText}
                        iconTint={color}
                        selectedIconTint={'#2095F2'}
                        selectedButtonStyle={{backgroundColor: 'transparent'}}
                        onPressAddImage={that.pickForUpload}
                        actions={action}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    rich: {
        minHeight: 300,
        flex: 1,
    },
    richBar: {
        height: 50,
        bottom: 0,
        backgroundColor: '#F5FCFF',
    },
    scroll: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    input: {
        flex: 1,
    },
});

