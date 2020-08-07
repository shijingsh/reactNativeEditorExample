/**
 *
 * @author tangzehua
 * @since 2019-06-24 15:07
 */

import React, {Component} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import ImagePicker from 'react-native-customized-image-picker';
import Util from "./common/utils";

export default class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {message:""}
    }

    pickForUpload = () => {
        let _this = this;
        let url = 'https://www.xiushangsh.com/upload.json';
        ImagePicker.openPicker({
            isCamera: true,
            compressQuality: 90,
        }).then(images => {
            Alert.alert('pick success');
            if (images && images.length) {
                let userImages = images.map(i => {
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
                });
                if(userImages&&userImages.length>0){
                    Util.multiPost(url,userImages,[],function (bean) {
                        _this.setState({message:JSON.stringify(bean)});
                    },function (err) {
                        _this.setState({message:JSON.stringify(err)});
                    })
                }
            }
        }).catch(e => {
            _this.setState({message:'upload catch error' +JSON.stringify(e)});
        });
    };

    loadData = () =>{
        let url = 'https://www.xiushangsh.com/shop/listPage.json';
        Util.get(url,function (data) {
            Alert.alert('loadData success');
        }, function (error) {
            Alert.alert('loadData error');
        })
    }

    onHome = () => {
        let {navigation} = this.props;
        navigation.push('index');
    };

    render() {
        let {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Button title={'back home'} onPress={() => {
                    this.onHome();
                }}/>
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

