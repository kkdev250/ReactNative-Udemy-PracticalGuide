import React, { useState } from 'react';

import GoalList from './components/GoalList/GoalList';
import NewGoal from './components/NewGoal/NewGoal';
import './App.css';

const App = () => {
  const [courseGoals, setCourseGoals] = useState([
    {id: 'cg1', text: 'Finish the Course'},
    {id: 'cg2', text: 'Learn all about the Course Main Topic'},
    {id: 'cg3', text: 'Help other students in the Course Q&A'}
  ]);

  const addNewGoalHandler = (newGoal) => {
    // const newGoals = [...courseGoals];
    // newGoals.push(newGoal); 
    // setCourseGoals(newGoals); //or:

    //setCourseGoals(courseGoals.concat(newGoal)); //don't do this - don't pass courseGoals (old state) into setNewGoals - old state could be inaccurte
    setCourseGoals((prevCourseGoals) => { //better way - use function that will return the reliable old state
      return prevCourseGoals.concat(newGoal);
    });

    
  }

  return (
    <div className="course-goals">
      <h2>Course Goals</h2>
      <NewGoal onAddGoal={addNewGoalHandler} />
      <GoalList goals={courseGoals}/>
    </div>
  );
};

export default App;
