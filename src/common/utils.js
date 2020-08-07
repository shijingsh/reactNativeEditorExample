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

    multiPost: (url,files, data, successCallback, failCallback) => {
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
        //formData.append("images",files);
        //let file = {uri: files[0].uri, type: 'multipart/form-data', name: 'a.jpg'};
        //formData.append("images",file);
        for(let i=0;i<data.length;i++){
            let obj = data[i];
            let value = obj.value;
            if(value !=null && value!=undefined && value!='undefined'){
                if(Array.isArray(value)){
                    for (let j = 0; j < value.length; j++) {
                        formData.append(obj.name,value[j]);
                    }
                }else{
                    formData.append(obj.name,value);
                }
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
