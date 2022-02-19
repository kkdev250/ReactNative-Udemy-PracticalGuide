import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts()); //fetchProducts returns promise! 
         //and dispatch thanks to redux-thunk also returns promise
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //to fetch data initially (first visit on this screen):
  useEffect(() => { //we should not use async functions in useEffect: 'useEffect( async () => {'
    setIsLoading(true);
    loadProducts().then(() => { //so we created an async function 'loadProducts' and call it here
      setIsLoading(false);
    }); 
  }, [dispatch, loadProducts]); //to avoid infinite loop loadProducts has to be wrapped in useCallback!!!

  //screens in DrawerNavigator are created only once, and then are not destroyed/recreated while leaving/visiting
  //..contrarty to StackNavigator where when you leave the screen it's destroyed and then re-created in next visit
  //so to fetch data after each subsequent navigate to this screen we have to setup a drawer navigator listener:
  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      loadProducts();
    });

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: {
        productId: id,
        productTitle: title,
      }
    }); //or just .navigate('ProductDetail', {productId: ...})
  };

  if (error) {
    return (
      <View style={styles.centered} >
        <Text>An error occurred!</Text>
        <Button title="Try again" onPress={loadProducts} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered} >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered} >
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
          onAddToCart={() => {
            ;
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    title: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    ),
  };
}

const styles = StyleSheet.create({
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
});

export default ProductsOverviewScreen;