'use strict';

import {Alert} from 'react-native';

let Util = {
    get: (url, successCallback, failCallback) => {
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                let result = JSON.parse(responseText);
                successCallback(result);
            })
            .catch((err) => {
                failCallback(err);
            });
    },

    multiPost: (url,files, successCallback, failCallback) => {
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
    },
    alert: (message) => {
        Alert.alert(message);
    }
};

export default Util;
