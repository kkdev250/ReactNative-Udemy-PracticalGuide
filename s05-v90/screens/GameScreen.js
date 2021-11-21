import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';
import DefaultStyles from '../constants/default-styles';

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

// const renderListItem = (value, numOfRound) => ( //verion for ScrollView
//   <View key={value} style={styles.listItem}>
//     <BodyText>#{numOfRound}</BodyText>
//     <BodyText>{value}</BodyText>
//   </View>
// );
  const renderListItem = (listLength, itemData) => ( //version for FlatList
  <View style={styles.listItem}>
    <BodyText>#{listLength - itemData.index}</BodyText>
    <BodyText>{itemData.item}</BodyText>
  </View>
  );

const GameScreen = props => {
  //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

  const initialGuess = generateRandomBetween(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props

  
  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get('window').width);
      setAvailableDeviceHeight(Dimensions.get('window').height);
    };
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    }
  });

  useEffect(() => {
    if (currentGuess === userChoice) {
      props.onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Sorry!", style: "cancel" },
      ]);
      return;
    }
    if (direction === 'lower') {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
    setCurrentGuess(nextNumber);
    setPastGuesses(curPastGuesses => [nextNumber.toString(), ...curPastGuesses]);
  };

  let listContainerStyle = styles.listContainer;
  if (availableDeviceWidth < 350) {
    listContainerStyle = styles.listContainerBig;
  }

  if (availableDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Opponent's Guess</Text>
      <View style={styles.controls}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButton>
        <NumberContainer>{currentGuess}</NumberContainer>
        <MainButton onPress={() => {nextGuessHandler('greater')}}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButton>
      </View>
      <View style={listContainerStyle}>
        <FlatList 
          contentContainerStyle={styles.list}
          keyExtractor={item => item}
          data={pastGuesses} 
          renderItem={renderListItem.bind(this, pastGuesses.length)} 
        />
      </View>
    </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.title}>Opponent's Guess</Text>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButton>
        <MainButton onPress={() => {nextGuessHandler('greater')}}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButton>
      </Card>
      <View style={listContainerStyle}>
        {/* <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}
        </ScrollView> */}
        <FlatList 
          contentContainerStyle={styles.list}
          keyExtractor={item => item} //data should be an array of objects, each object should have 'key' of 'id' (strings!) - if there is no 'key' or 'id' - we provide keyExtrator
          data={pastGuesses} 
          renderItem={renderListItem.bind(this, pastGuesses.length)} 
          // .bind(): 'this' is not important here, could be 'null', 
          //          pastGuesses.length will be the FIRST argument in renderListItem function (i.e. 'listLength')
          //          and the default argument that would have been passed normally to a function will be added as SECOND one (i.e. 'itemData')
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
    width: 400,
    maxWidth: '90%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  listContainer: {
    flex: 1, //to make ScrollView list scrollable!!!
    //width: '80%', //was ok for ScrollView
    width: '60%', //changed for FlatList
    //width: Dimensions.get('window').width > 350 ? '60%' : '80%',
  },
  listContainerBig: {
    flex: 1,
    width: '80%',
  },
  list: {
    flexGrow: 1, //flexGrow, not flex!
    //alignItems: 'center', //was ok for ScrollView
    justifyContent: 'flex-end',
  },
  listItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    //width: '60%', //was ok for ScrollView
    width: '100%', //changed for FlatList
  },
});

export default GameScreen;