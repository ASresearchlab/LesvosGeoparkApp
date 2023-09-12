import React, {useContext, useEffect, useRef} from 'react';
import {Linking, Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';
import {Account, CategoryList, Discovery, Empty, Home, WishList,Listing, Feedback, Geopark, Visit,Activities, TestPage, Routes} from '@screens';
import {Application, getFontFamily, Icon, Text} from '@components';
import {Setting, Styles} from '@configs';
import Navigator from '@navigator';
import {useSelector} from 'react-redux';
import {settingSelect} from '@selectors';
import {DeeplinkModel, NotificationModel} from '@models';

const Tab = createBottomTabNavigator();

export default function Main() {
  const settings = useSelector(settingSelect);
  const {theme, font} = useContext(Application);
  const {t} = useTranslation();
  const debounceDeepLink = useRef();

  useEffect(() => {
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL()
      .then(handleDeepLink)
      .catch(error => {});
    messaging().onNotificationOpenedApp(handleNotification);
    messaging().getInitialNotification().then(handleNotification);
    return () => {
      linkingSubscription.remove();
    };
  }, []);

  /**
   * handle deeplink
   * @param data
   */
  const handleDeepLink = data => {
    if (data) {
      clearTimeout(debounceDeepLink.current);
      debounceDeepLink.current = setTimeout(() => {
        const deeplink = DeeplinkModel.fromString(data?.url ?? data);
        if (deeplink && deeplink.target) {
          if (deeplink.authentication) {
            Navigator.navigateAuth(deeplink.target, {item: deeplink.item});
          } else {
            Navigator.navigate(deeplink.target, {item: deeplink.item});
          }
        }
      }, 250);
    }
  };

  /**
   * on process notification
   */
  const handleNotification = item => {
    const notification = NotificationModel.fromJson(item?.data);
    if (notification && notification.target) {
      if (notification.authentication) {
        Navigator.navigateAuth(notification.target, {item: notification.item});
      } else {
        Navigator.navigate(notification.target, {item: notification.item});
      }
    }
  };

  /**
   * on navigate
   * @param name
   */
  const onAuthNavigate = name => {
    Navigator.navigateAuth(name);
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: theme.colors.primary,
        tabBarActiveTintColor: theme.colors.secondary,
        headerShown: false,
        headerTitle: props => {
          return <Text {...props} typography="h4" weight="bold" />;
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: getFontFamily({fontFamily: font}), marginBottom:10, 
          width:200
        },
        
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="home-outline" />;
          },
        }}
      />

      <Tab.Screen
        name="Geopark"
        component={Geopark}
        options={{
          headerShown:true,
          headerTitle:t('geopark'),
          headerTitleStyle:{
            fontSize:16,
          },
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={2} // Set the number of lines to allow wrapping
              style={{ textAlign: 'center',fontSize: 10,
              fontFamily: getFontFamily({fontFamily: font}),marginBottom:-1,  }}
            >
              {focused ? t('geopark') : t('geopark')}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon color={color} name="bank" />
          ),
        }}
      />
<Tab.Screen
        name="Discovery"
        component={Discovery}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={2} // Set the number of lines to allow wrapping
              style={{ textAlign: 'center',fontSize: 10,
              fontFamily: getFontFamily({fontFamily: font}),marginBottom:-1,  }}
            >
              {focused ? t('interest_points') : t('interest_points')}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon color={color} name="map-marker-radius-outline" />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={Activities}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('activities'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="gauge" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      />
      <Tab.Screen
        name="Routes"
        component={Routes}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('routes'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="routes" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      />

      

      {/* {settings?.enableSubmit && (
        <Tab.Screen
          name="Empty"
          component={Empty}
          options={{
            tabBarButton: props => (
              <SubmitButton
                {...props}
                onPress={() => onAuthNavigate('Submit')}
              />
            ),
          }}
        />
      )} */}
      
     

     {/* <Tab.Screen
        name="map"
        component={Feedback}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('map'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="map-legend" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      /> */}

      
      {/* <Tab.Screen
        name="Edu"
        component={WishList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('education'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="school-outline" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      /> */}
      
      {/* <Tab.Screen
        name="News"
        component={WishList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('news'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="newspaper-variant-multiple" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      /> */}

      {/* <Tab.Screen
        name="Tickets"
        component={WishList}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('tickets'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="ticket-outline" />;
          },
          // tabBarButton: props => (
          //   <Pressable {...props} onPress={() => onAuthNavigate('WishList')} />
          // ),
        }}
      />
       */}

    

      {/* <Tab.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="account-outline" />;
          },
          tabBarButton: props => (
            <Pressable {...props} onPress={() => onAuthNavigate('Account')} />
          ),
        }}
      /> */}



      {/* <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Icon color={color} name="account-outline" />;
          },
          tabBarButton: props => (
            <Pressable {...props} onPress={() => onAuthNavigate('Account')} />
          ),
        }}
      /> */}
    </Tab.Navigator>
    
  );
}

// const SubmitButton = props => {
//   const {theme} = useContext(Application);
//   return (
//     <Pressable
//       {...props}
//       style={[styles.button, {backgroundColor: theme.colors.primary}]}>
//       <Icon name="plus" color="white" />
//     </Pressable>
//   );
// };

const styles = StyleSheet.create({
  button: {
    top: -28,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
});
