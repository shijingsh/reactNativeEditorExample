import Util from '../common/utils';

export let uploadFile = (files,callback) => {
    let url = 'https://www.xiushangsh.com/upload.json';

    return (dispatch) => {

        Util.multiPost(url,files,[],
            (result) => {
                let uploadBean = {};
                if (result && result.data) {
                    uploadBean = result.data;
                }
                callback(uploadBean)
            },
            (error) => {
                Util.alert(error.message);
            });
    }
};
