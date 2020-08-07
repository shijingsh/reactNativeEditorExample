/**
 *
 * @author tangzehua
 * @since 2019-06-24 15:07
 */

import React, {Component} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import ImagePicker from 'react-native-customized-image-picker';

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {message:""}
    }

    multiPost = (file, successCallback, failCallback) => {
        let obj = file[0]
        let url = 'https://www.xiushangsh.com/upload.json';
        let formData = new FormData();
        if (!obj.type) {
            obj.type = 'multipart/form-data';
        }
        if (!obj.name) {
            let tmp = obj.uri;
            if (tmp) {
                let index = tmp.lastIndexOf('/');
                if (index != -1) {
                    obj.name = tmp.substr(index + 1);
                }
            } else {
                obj.name = 'image0.jpg';
            }
        }
        this.setState({message:'obj' +JSON.stringify(obj)});
        formData.append('images0', obj);

        let fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
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
    };

    pickForUpload = () => {
        let _this = this;

        ImagePicker.openPicker({
            isCamera: true,
            compressQuality: 90,
        }).then(images => {
            Alert.alert('pick success');
            if (images && images.length) {
                let imageList = [];
                imageList.push(images[0]);
                _this.multiPost(imageList, function (uploadImages) {
                    Alert.alert('upload success');
                }, function (error) {
                    Alert.alert('upload error');
                });
            }
        }).catch(e => {
            _this.setState({message:'upload catch error' +JSON.stringify(e)});
        });
    };

    getJson =(url, successCallback, failCallback)=>{
            fetch(url)
                .then((response) => response.text())
                .then((responseText) => {
                    let result = JSON.parse(responseText);
                    successCallback(result);
                })
                .catch((err) => {
                    failCallback(err);
                });
    }

    loadData = () =>{
        let _this = this;
        let url = 'https://www.xiushangsh.com/shop/listPage.json';
        this.getJson(url,function (data) {
            _this.setState({message:'load success' +JSON.stringify(data)});
        }, function (error) {
            _this.setState({message:'load error' +JSON.stringify(error)});
        })
    }

    render() {
        let {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>normal requests</Text>
                <Button title={'normal request'} onPress={() => {
                    this.loadData();
                }}/>
                <Text style={styles.welcome}>upload example</Text>
                <Button title={'upload request'} onPress={() => {
                    this.pickForUpload();
                }}/>
                <Text style={styles.welcome}>upload example with webview</Text>
                <Button title={'upload request with webview'} onPress={() => navigation.push('rich', {theme: 'light'})}/>

                <Text style={styles.message}>{this.state.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    message: {
        fontSize: 20,
        color:"red",
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

