import React from 'react';
import { Platform, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import CategoriesScreen  from '../screens/CategoriesScreen';
import CategoryMealsScreen from '../screens/CategoryMealsScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import FiltersScreen from '../screens/FiltersScreen';
import Colors from '../constants/Colors';

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBactTitleStyle: { //ios only
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
};

const MealsNavigator = createStackNavigator(
  { 
    Categories: {
      screen: CategoriesScreen,
      navigationOptions: {
        headerTitle: 'Meal Categories',
      }
    },
    CategoryMeals: CategoryMealsScreen,
    MealDetail: MealDetailScreen,
    //pattern: RouteName: Component
  },//all these above 3 components will get a special 'navigation' prop
  {
    //initialRouteName: 'Categories',
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const FavNavigator = createStackNavigator(
  {
    Favorites: FavoritesScreen,
    MealDetail: MealDetailScreen,
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);


const tabScreenConfig = { 
  Meals: { //pattern for tab navigator: TabName: Component/Navigator / { screen: Component/Navigator }
    screen: MealsNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='ios-restaurant' size={25} color={tabInfo.tintColor} />
      },
      tabBarColor: Colors.primaryColor, //only works if shifting: true
      tabBarLabel: Platform.OS === 'android' ? <Text style={{fontFamily: 'open-sans-bold'}}>Meals</Text> : 'Meals',
    }
  },
  Favorites: {
    screen: FavNavigator,
    navigationOptions: {
      tabBarLabel: Platform.OS === 'android' ? <Text style={{fontFamily: 'open-sans-bold'}}>Favorites</Text> : 'Favorites',
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='ios-star' size={25} color={tabInfo.tintColor} />
      },
      tabBarColor: Colors.accentColor,
    }
  },
};

const MealsFavTabNavigator = 
  Platform.OS === 'android' 
    ? createMaterialBottomTabNavigator(
        tabScreenConfig,
        {
          activeColor: 'white',
          shifting: true,
          /*shifting: false,
          barStyle: {
            backgroundColor: Colors.primaryColor,
          }*/
        },
      )
    : createBottomTabNavigator(
        tabScreenConfig,
        {
          tabBarOptions: {
            labelStyle: {
              fontFamily: 'open-sans',
            },
            activeTintColor: Colors.accentColor,
          }
        }
      );


const FiltersNavigator = createStackNavigator(
  {
    Filters: FiltersScreen, 
  }, //only one screen in this navigator - but there will be a header thanks to the navigator
  {
    /*navigationOptions: { //these options are NOT for screens inside this navigator, but for the navigator itself when it's used inside some other navigator
      drawerLabel: 'Filters!!!!',
    },*/
    defaultNavigationOptions: defaultStackNavOptions, //these options ARE for all screnns inside this navigator
  }
);

const MainNavigator = createDrawerNavigator(
  {
    MealsFavs: {
      screen: MealsFavTabNavigator,
      navigationOptions: { //alternatively you can setup the options and label here, not only when creating the stack navigator (above)
        drawerLabel: 'Meals'
      }
    },
    Filters: FiltersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.accentColor,
      labelStyle: {
        fontFamily: 'open-sans-bold'
      }
    },
  }
);

export default createAppContainer(MainNavigator); 
