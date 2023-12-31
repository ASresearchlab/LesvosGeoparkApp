import React, { useContext, useState } from 'react';
import { RefreshControl, useWindowDimensions, View, Image, Text, FlatList, } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Application,
  ImageSlider,
  SafeAreaView,
  SearchPicker,
  SizedBox,

} from '@components';
import { Styles, Images } from '@configs';
import { homeSelect } from '@selectors';
import { homeActions } from '@actions';
import Categories from './components/category';
import Locations from './components/location';
import Recent from './components/recent';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Home({ navigation }) {
  const insets = useSafeAreaInsets();
  const { height: heightDevice } = useWindowDimensions();
  const bannerHeight = heightDevice * 0.3;
  const { theme } = useContext(Application);
  const { t } = useTranslation();
  const home = useSelector(homeSelect);
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(
    ({ layoutMeasurement, contentOffset, contentSize }) => {
      if (layoutMeasurement.height + contentOffset.y >= contentSize.height) {
        return;
      }
      translationY.value = contentOffset.y;
    },
  );
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(
      homeActions.onLoad(() => {
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
   * onPress category
   * @param item
   */
  const onCategory = item => {
    if (item?.hasChild) {

      navigation.push('CategoryList', { item });
    } else {
      navigation.navigate('Listing', { item });
    }
  };

  /**
   * on press product
   */
  const onPressProduct = item => {
    navigation.navigate('ProductDetail', { item });
  };

  /**
   * on press category list
   */
  const onCategoryList = () => {
    navigation.navigate('CategoryList');
  };

  const actionStyle = useAnimatedStyle(() => {
    const minHeight = insets.top + 60;
    const height = withTiming(
      interpolate(
        translationY.value,
        [0, 0, bannerHeight, bannerHeight],
        [bannerHeight, bannerHeight, minHeight, minHeight],
      ),
      { duration: 0 },
    );
    return {
      height,
      position: 'absolute',
      backgroundColor: theme.colors.background,
      zIndex: 1,
    };
  });
  console.log(home?.banner)
  return (
    <View style={Styles.flex}>
      <Animated.View style={actionStyle}>
        <ImageSlider
          data={home?.banner?.map(item => {
            return {
              image: item,
            };
          })}
          style={styles.slider}
          paginationStyle={styles.sliderDot}
        />
        <SizedBox height={28} />
        <SafeAreaView edges={['left', 'right']} mode="margin">
          <SearchPicker
            style={styles.searchContainer}
            onSearch={onSearch}
            onScan={onScan}
          />
        </SafeAreaView>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            progressViewOffset={bannerHeight}
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text}
            title={t('pull_to_reload')}
            titleColor={theme.colors.text}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.card}
          />
        }>
        <SafeAreaView edges={['left', 'right']} mode="margin">
          <SizedBox height={bannerHeight} />
          <SizedBox height={12} />
          <Categories
            data={home?.category}
            onPress={onCategory}
            onCategoryList={onCategoryList}
          />
          <Image source={Images.logo} resizeMode='contain' style={{ width: '100%', height: 70, marginTop: 30, marginBottom: 0, marginLeft: 0 }} />
          <SizedBox height={20} />
          <View>
            <SizedBox height={12} />
            {/* <Locations data={home?.location} onPress={onCategory} /> */}
            <Locations data={home?.recent} onPress={onPressProduct} />
            {/* <Recent data={home?.recent} onPress={onPressProduct} /> */}
            <SizedBox height={12} />

          </View>
        </SafeAreaView>
      </Animated.ScrollView>
    </View>
  );
}
