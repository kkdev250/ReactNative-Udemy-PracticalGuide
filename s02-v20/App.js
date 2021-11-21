import React, {useState} from 'react';
import { StyleSheet, View, Button, FlatList } from 'react-native';

import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';

export default function App() {
  const [courseGoals, setCourseGoals] = useState([]); //array of objects: {key: string, ...} for FlatList
  const [isAddMode, setIsAddMode] = useState(false);

  const addGoalHandler = goalTitle => {
    setCourseGoals(currentGoals => [
      ...currentGoals, 
      { shouldBeKey: Math.random().toString(), value: goalTitle } //if in data key is named differently - you have to add keyExtractor in FlatList
    ]); 
    setIsAddMode(false);
  };

  const removeGoalHandler = goalId => {
    setCourseGoals(currentGoals => currentGoals.filter(goal => goal.shouldBeKey !== goalId));
  }

  const cancelGoalAdditionHandler = () => setIsAddMode(false);

  return (
    <View style={styles.screen}>
      <Button title="Add New Goal" onPress={() => setIsAddMode(true)} />
      <GoalInput 
        visible={isAddMode} 
        onAddGoal={addGoalHandler} 
        onCancel={cancelGoalAdditionHandler}
      />
      {/*<ScrollView>
        {courseGoals.map(goal => <View key={goal} style={styles.listItem}> <Text>{goal}</Text> </View>)}
      </ScrollView>*/}
      <FlatList
        keyExtractor={(item, index) => item.shouldBeKey /*in case there is no 'key' in data*/} 
        data={courseGoals} 
        renderItem={itemData => (  
          <GoalItem 
            id={itemData.item.shouldBeKey} 
            onDelete={removeGoalHandler} 
            title={itemData.item.value} 
          />
        )} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
});
