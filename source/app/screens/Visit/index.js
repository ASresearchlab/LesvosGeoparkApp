import React, { useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Application,
  Empty,
  Icon,
  ProductItem,
  ScreenContainer,
  SearchPicker,
  SizedBox,
  Text,
} from '@components';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  Image,
  Button,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './styles';
import { Styles } from '@configs';
import { discoveryActions } from '@actions';
import { discoverySelect } from '@selectors';
import { convertIcon } from '@utils';

export default function Discovery({ navigation }) {
  const { theme } = useContext(Application);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector(discoverySelect);
  const [showWebView, setShowWebView] = useState(false);
  const [url, setUrl] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => setReady(true), 1);
  }, []);

  /**
   * on refresh
   */
  const openWebView = (webUrl) => {
    setUrl(webUrl);
    setShowWebView(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const closeWebView = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowWebView(false);
      setUrl('');
    });
  };
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      discoveryActions.onLoad(() => {
        setRefreshing(false);
      }),
    );
  };

  /**
   * on search
   */


  const onSearch = () => {
    navigation.navigate('Search');
  };

  /**
   * on scan qrcode
   */
  const onScan = () => {
    navigation.navigate('ScanQR');
  };

  /**
   * on press category
   */
  const onPressCategory = item => {
    navigation.navigate('Listing', { item: item.category });
  };
  const onPressCategoryList = item => {
    navigation.navigate('CategoryList', { item: item.category });
  };
  /**
   * on press product
   */
  const onPressProduct = item => {
    navigation.navigate('ProductDetail', { item });
  };

  /**
   * render item
   * @param item
   * @returns {JSX.Element}
   */
  const renderItem = ({ item }) => {
    if (item.category.title === 'Επίσκεψη') {
      return (
        <>
          <View style={styles.item}>
            <View style={Styles.row}>
              {/* <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: item.category?.color,
                },
              ]}>
              <Icon
                {...convertIcon(item.category?.icon)}
                size={18}
                color="white"
                type="FontAwesome5"
              />
            </View>  */}
              <Image source={{ uri: item?.category?.image?.thumb }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode='contain' />
              <View style={Styles.paddingHorizontal8}>
                <Text typography="title" weight="bold">
                  {item.category?.title}
                </Text>
                <SizedBox height={4} />
                {/* <Text typography="caption" type="secondary">
                {item.category?.count} {t('location')}
              </Text> */}
              </View>
            </View>
            <TouchableOpacity
              style={Styles.padding4}
              onPress={() => onPressCategoryList(item)}>
              <Text typography="caption" color="secondary">
                {t('see_more')}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={Styles.padding8}
            data={item.list}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={renderProduct}
            keyExtractor={(i, index) => `${i?.id}${index}`}
          />
        </>
      );
    }
  };

  /**
   * render product item
   * @param item
   * @returns {JSX.Element}
   */
  const renderProduct = ({ item }) => {
    return (
      <View style={styles.productItem}>
        <ProductItem
          item={item}
          type="thumb"
          onPress={() => onPressProduct(item)}
        />
      </View>
    );
  };

  const renderContent = () => {
    if (ready) {
      return (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.text}
              title={t('pull_to_reload')}
              titleColor={theme.colors.text}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.card}
            />
          }
          data={data ?? []}
          renderItem={renderItem}
          ListEmptyComponent={
            <Empty
              loading={!data}
              style={Styles.flex}
              title={t('not_found_matching')}
              message={t('please_check_keyword_again')}
            />
          }
          keyExtractor={(item, index) => `${item?.id}${index}`}
          style={Styles.flex}
          contentContainerStyle={styles.listContainer}
        />
      );
    }
    return (
      <View style={Styles.flexCenter}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  };

  return (
    <ScreenContainer navigation={navigation} edges={['left', 'right', 'top']}>
      
      {renderContent()}
      <View style={{ flex: showWebView ? 100 : 1 }}>
        {showWebView ? (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <WebView
              source={{ uri: url }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            {/* <Button title={`\u00AB ${'Επιστροφη'}`} onPress={closeWebView} /> */}
            <Button title={`\u00AB ${'Επιστροφη'}`} onPress={closeWebView} />
          </Animated.View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => openWebView('https://www.lesvosmuseum.gr/e-shop/tickets')}
            >
              <Text style={{ backgroundColor: '#FFE177', color: 'black', padding: 5, borderRadius: 5, fontSize: 18, fontFamily: 'Arial' }}>
                ΕΙΣΗΤΗΡΙΑ
                
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

