import React, { Component } from 'react';
import Layout from './containers/Layout/Layout'

import { library } from '@fortawesome/fontawesome-svg-core'
import { icons } from './icons';
// library.add(...fontAwesome)

var ic = Object.keys(icons).map(iconName => icons[iconName])
library.add(...ic)

class App extends Component {
  render() {
    return <Layout />;
  }
}

export default App;
