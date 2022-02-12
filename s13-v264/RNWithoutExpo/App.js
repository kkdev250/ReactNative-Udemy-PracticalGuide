/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {
  View,
  StyleSheet,
  Button,
} from 'react-native';

const App = () => {
  return (
    <View>
      <Button title="Take Image" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
