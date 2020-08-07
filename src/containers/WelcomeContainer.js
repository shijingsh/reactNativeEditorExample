import React, {Component} from 'react';
import {connect} from 'react-redux';
import Welcome from '../welcome2';

class WelcomeContainer extends Component {
    render() {
        return (
            <Welcome {...this.props} />
        )
    }
}

export default connect((state) => {
    return { homeReducer} = state;
})(WelcomeContainer);
