import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View, Text, ImageBackground, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors, Images,Setting } from '@configs';
import SplashScreen from 'react-native-splash-screen';
import { Application, Image, SizedBox } from '@components';
import { applicationActions } from '@actions';
import styles from './styles'; // Import your stylesheet here
import { useTranslation } from 'react-i18next';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Splash({ navigation }) {
  const {t, i18n} = useTranslation();
  const { theme } = useContext(Application);
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

    <View style={styles.container}>
    <View style={{alignItems: 'center'}}>
      <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      <Text  style={{marginTop: 8, fontSize: 24,color:"#000"}}>
        {Setting.name}
      </Text>
      <Text style={{marginTop: 20,fontSize:18,color:'#000',fontWeight:'bold',textAlign:'center',paddingHorizontal:10}}>
      {t('splash')}
      </Text>
    </View>
    <ActivityIndicator
      size="large"
      color={'#e09900'}
      style={{
        marginVertical:40       
      }}
    />
    <Image source={Images.espa} resizeMode='contain' style={{width:'100%',height:90}}/> 
  </View>





    // <ImageBackground
    //   source={Images.splash}
    //   style={[styles.container]}
    // >
    //   <View style={[styles.contentLogo, { width: windowWidth, alignItems: 'flex-end' }]}>
    //     <View style={styles.logoContainer}>
    //       <Text style={styles.logoText}> Γεωπάρκο Λέσβου </Text>
    //       <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
    //     </View>
    //     <SizedBox height={windowHeight * 0.1} />


    //   </View>
    //   <View style={[styles.contentLogo2, { width: windowWidth }]}>
    //     <Image source={Images.espa} style={styles.logo2} resizeMode="contain"><Text style={styles.descriptionText}>Το έργο συγχρηματοδοτείται από το Ευρωπαϊκό Ταμείο Περιφερειακής Ανάπτυξης και από εθνικούς πόρους στο πλαίσιο του Επιχειρησιακού Προγράμματος «Βόρειο Αιγαίο 2014-2020»</Text></Image>
    //   </View>
    //   <ActivityIndicator
    //     size="large"
    //     color={Colors.white}
    //     style={styles.loading}
    //   />
    // </ImageBackground>
  );
}
