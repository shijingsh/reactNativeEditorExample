import React, {Component} from 'react';
import {
  Appearance, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  SafeAreaView,
  InteractionManager,
  ScrollView,
  Alert
} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-editor';
import ImagePicker from "react-native-customized-image-picker";

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

  onPressInsert = () => {
    this.richText.setContentHTML("<p>insert by setContentHTML</p>");
  }

  onPressAppendInsert = () => {
    this.richText.appendContentHTML("<p>append by appendContentHTML</p>");
  }

  onPressGotFocus = () => {
    this.richText.focusContentEditor();
  }
  multiPost = (files, successCallback, failCallback) => {
    let url = "https://www.xiushangsh.com/upload.json";
    let formData = new FormData();
    for(let i=0;files&&i<files.length;i++){
      let obj = files[i];
      if(!obj.type){
        obj.type = 'multipart/form-data';
      }
      if(!obj.name){
        let tmp = obj.uri;
        if(tmp){
          let index = tmp.lastIndexOf("/");
          if(index!= -1){
            obj.name = tmp.substr(index+1);
          }
        }else{
          obj.name = 'image'+i+".jpg";
        }
      }
      if(obj.key){
        formData.append(obj.key,obj);
      }else {
        formData.append("images"+i,obj);
      }
    }

    let fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    };

    fetch(url, fetchOptions)
        .then((response) => response.text())
        .then((responseText) => {
          let result = JSON.parse(responseText);
          successCallback(result);
        })
        .catch((err) => {
          console.log(err);
          failCallback(err);
        });
  }

  pickForEdit = () => {
    let _this = this;

    ImagePicker.openPicker({
      isCamera: true,
      compressQuality: 90
    }).then(images => {
      _this.richText.appendContentHTML("<p>openPicker:"+JSON.stringify(images)+"</p>");
      if (images && images.length) {
        let imageList = [];
        imageList.push(images[0]);
        _this.multiPost(imageList, function (uploadImages) {
          _this.richText.appendContentHTML("<p>successCallback:"+JSON.stringify(uploadImages)+"</p>");
          let imageList = ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png"];

          _this.richText.insertImage({src: imageList[0]});
          _this.richText.blurContentEditor();
        },function (error) {
          _this.richText.appendContentHTML("<p>failCallback:"+JSON.stringify(error)+"</p>");
        })
      }
    }).catch(e => {
      _this.richText.appendContentHTML("<p>openPicker catch:"+JSON.stringify(e)+"</p>");
    });
  }


  createContentStyle (theme){
    const contentStyle = {backgroundColor: '#000033', color: '#fff', placeholderColor: 'gray'};
    if (theme === 'light') {
      contentStyle.backgroundColor = '#fff';
      contentStyle.color = '#000033';
      contentStyle.placeholderColor = '#a9a9a9';
    }
    return contentStyle;
  }

  async onPressGotValue() {
    // Get the data here and call the interface to save the data
    let html = await this.richText.getContentHtml();
    // console.log(html);
    alert(html);
  }

  render() {
    let that = this;
    const {contentStyle, theme} = that.state;
    const {backgroundColor, color, placeholderColor} = contentStyle;
    const themeBg = {backgroundColor};
    return (
        <SafeAreaView style={styles.container}>
          <View style={{flexDirection: 'row', height: 50, alignItems: 'center',justifyContent: 'center', backgroundColor: '#847b66'}}>
            <TouchableOpacity style={{marginLeft: 10, padding: 5}} onPress={()=>that.pickForEdit()}>
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
                onPressAddImage={that.pickForEdit}
            />
          </KeyboardAvoidingView>

        </SafeAreaView>
    );
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richText.getTitleHtml();
    const contentHtml = await this.richText.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }

  setFocusHandlers() {
    this.richText.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richText.setContentFocusHandler(() => {
      //alert('content focus');
    });
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
    bottom:0,
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

