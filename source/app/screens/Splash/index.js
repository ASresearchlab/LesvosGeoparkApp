import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, View,Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {Colors, Images} from '@configs';
import SplashScreen from 'react-native-splash-screen';
import {Application, Image,SizedBox} from '@components';
import {applicationActions} from '@actions';
import styles from './styles';

export default function Splash({navigation}) {
  const {theme} = useContext(Application);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      applicationActions.start(() => {
        navigation.replace('Main');
      }),
    );
    SplashScreen.hide();
  }, [dispatch, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.third}]}>
      <View style={styles.contentLogo}>

      <View style={{alignItems: 'center'}}>

      <Text style={{marginTop: 0,textAlign:'center',paddingHorizontal:5,fontSize:20,color:theme.colors.primary,fontWeight:'bold'}}>
        Γεωπάρκο Λέσβου
        </Text>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />

        <ActivityIndicator
            size="large"
            color={Colors.white}
            style={styles.loading}
          />
        
      </View>
      
        {/* <View style={styles.logo}>
          <Image
            source={Images.logo}
            resizeMode="contain"
            style={styles.container}
          />

          
          <ActivityIndicator
            size="large"
            color={Colors.white}
            style={styles.loading}
          />
        </View> */}
      </View>
    </View>
  );
}
