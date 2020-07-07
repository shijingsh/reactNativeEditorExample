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

    multiPost = (files, successCallback, failCallback) => {
        let url = 'https://www.xiushangsh.com/upload.json';
        let formData = new FormData();
        for (let i = 0; files && i < files.length; i++) {
            let obj = files[i];
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
                    obj.name = 'image' + i + '.jpg';
                }
            }
            if (obj.key) {
                formData.append(obj.key, obj);
            } else {
                formData.append('images' + i, obj);
            }
        }

        let fetchOptions = {
            method: 'POST',
/*            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },*/
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
                    _this.setState({message:'upload error' +JSON.stringify(error)});
                });
            }
        }).catch(e => {
            _this.setState({message:'upload catch error' +JSON.stringify(e)});
        });
    };

    render() {
        let {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Examples of successful requests</Text>
                <Button title={'Successful request'} onPress={() => {
                    this.pickForUpload();
                }}/>
                <Text style={styles.welcome}>Example of request failure</Text>
                <Button title={'error request'} onPress={() => navigation.push('rich', {theme: 'light'})}/>


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

