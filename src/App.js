/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import store from './store/store';
import React, {Component} from 'react';
import RichTextExample from './example';
import Welcome from './welcome';
import WelcomeContainer from './containers/WelcomeContainer';
import {Provider} from 'react-redux';

const Routes = {
    index: Welcome,
    indexContainer:WelcomeContainer,
    rich: RichTextExample,
};

type Props = {};
type State = {
    routeKey: string,
};

class App extends Component<Props, State> {
    state = {
        routeKey: 'index',
        args: {},
    };

    push = (routeKey, args) => {
        Routes[routeKey] && this.setState({routeKey, args});
    };

    render() {
        let that = this;
        let {routeKey, args = {}} = that.state;
        let Comp = Routes[routeKey];
        return (
            <Provider store = {store} >
                <Comp navigation={that} {...args} />
            </Provider>

        );
    }
}

export default App;
