import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Geojson } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
  Text,
  Button,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Application,
  BottomSheetView,
  Divider,
  Empty,
  Icon,
  IconButton,
  ListItem,
  ProductItem,
  ScreenContainer,
  SizedBox,
} from '@components';
import { Styles, Images } from '@configs';
import { listingActions } from '@actions';
import Action from './components/action';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { listingSelect, settingSelect } from '@selectors';
import { FilterModel } from '@models';
import Carousel from 'react-native-snap-carousel';
import { enableExperimental, getCurrentLocation } from '@utils';
import WebView from 'react-native-webview';


export default function Index({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useContext(Application);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const listing = useSelector(listingSelect);
  const setting = useSelector(settingSelect);
  const listRef = useRef();
  const sortRef = useRef();
  const mapRef = useRef();
  const filter = useRef(FilterModel.fromSettings(setting)).current;
  const defaultDelta = { latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
  const sliderRef = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [pageStyle, setPageStyle] = useState('map');
  const [modeView, setModeView] = useState('grid');
  const [sort, setSort] = useState(filter.sort);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const MAP_API_KEY = 'AIzaSyDsyKauf-1xG9g4hoL4OSfx1h-yI0s0Kq4';
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [geoJsonData2, setGeoJsonData2] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const product = route.params?.item;
  const { item } = route.params;
  const website2 = item?.website2;


  //maproute
  useEffect(() => {
    const geoJsonUrl = product?.address;

    fetch(geoJsonUrl)
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data); // Store the fetched GeoJSON data in the state
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, []);



  useEffect(() => {
    if (route.params?.item) {
      filter.setCategory = route.params?.item;
    }
    dispatch(listingActions.onLoad({ filter }));
    return () => dispatch(listingActions.onReset());
  }, [dispatch, filter, route.params]);

  /**
   * on refresh
   */

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(
      listingActions.onLoad({ filter }, () => {
        setRefreshing(false);
      }),
    );
  };

  /**
   * on current location
   */
  const onCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (result) {
      mapRef.current?.animateToRegion({ ...result, ...defaultDelta }, 500);
    }
  };

  /**
   * change map style
   */
  const onChangePageStyle = () => {
    setPageStyle(pageStyle === 'listing' ? 'map' : 'listing');
  };

  /**
   * change mode view
   */
  const onChangeViewStyle = () => {
    enableExperimental();
    let nextView;
    switch (modeView) {
      case 'list':
        nextView = 'block';
        break;
      case 'block':
        nextView = 'grid';
        break;
      default:
        nextView = 'list';
    }
    setModeView(nextView);
  };

  /**
   * on change sort
   * @param item
   */
  const onChangeSort = item => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    filter.update({ sort: item });
    sortRef.current?.dismiss();
    setSort(item);
    dispatch(listingActions.onLoad({ filter, loading: true }));
  };

  /**
   * on filter
   */
  const onFilter = () => {
    navigation.navigate('Filter', {
      filter,
      onApply: () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
        dispatch(listingActions.onLoad({ filter, loading: true }));
      },
    });
  };

  /**
   * on press product
   */
  const onPressProduct = item => {
    navigation.navigate('ProductDetail', { item });
  };

  /**
   * on load more
   */
  const onMore = () => {
    if (listing.pagination?.allowMore) {
      dispatch(listingActions.onLoadMore(filter));
    }
  };

  /**
   * render item list
   * @param item
   * @returns {JSX.Element}
   */
  const renderItem = ({ item }) => {
    switch (modeView) {
      case 'block':
        return (
          <ProductItem
            item={item}
            style={styles.item}
            onPress={() => onPressProduct(item)}
            type={modeView}
          />
        );
      case 'grid':
        return (
          <View style={[Styles.flex, Styles.paddingHorizontal8]}>
            <ProductItem
              item={item}
              style={styles.item}
              onPress={() => onPressProduct(item)}
              type={modeView}
            />
          </View>
        );
      default:
        return (
          <View style={Styles.paddingHorizontal16}>
            <ProductItem
              item={item}
              style={styles.item}
              onPress={() => onPressProduct(item)}
              type={modeView}
            />
          </View>
        );
    }
  };

  /**
   * render data listing
   * @type {unknown}
   */
  const data = useMemo(() => {
    if (listing.data) {
      if (listing.pagination.allowMore) {
        return [...listing.data, ...[{}]];
      }
      return listing.data;
    } else {
      return Array.from({ length: 10 }, () => {
        return {};
      });
    }
  }, [listing]);

  /**
   * render bottom sheet select sort list
   * @returns {JSX.Element}
   */
  const renderSelectSort = () => {
    return (
      <BottomSheetView ref={sortRef}>
        <View style={styles.bottomSheetContainer}>
          {setting.sort.map?.((item, index) => {
            let trailing;
            if (item.field === sort.field && item.value === sort.value) {
              trailing = (
                <Icon
                  name="check"
                  style={Styles.paddingHorizontal16}
                  color={theme.colors.primary}
                />
              );
            }
            return (
              <View key={`${item?.field}-${item?.value}`}>
                <ListItem
                  title={t(item?.title)}
                  trailing={trailing}
                  onPress={() => onChangeSort(item)}
                />
                {index < setting.sort.length - 1 && <Divider />}
              </View>
            );
          })}
        </View>
      </BottomSheetView>
    );
  };
  const CustomMarker = ({ coordinate, number }) => (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 1 }}>
      <Image
        source={Images.mapPin} // Replace with your image path
        style={{
          width: 40,  // Set the width and height to match your image size
          height: 60,
          resizeMode: 'contain', // Maintain aspect ratio
        }}
      />
      <Text style={{
        color: 'green', fontWeight: 'bold', position: 'absolute', top: 15, left: 10.5,
        backgroundColor: 'white', width: 20, height: 20, borderRadius: 10, textAlign: 'center'
      }}>
        {number}
      </Text>

    </Marker>
  );
  // const onMarkerPress = (feature) => {
  //   setSelectedFeature(feature);
  //   setModalVisible(true);
  // };
  // const openModal2 = () => {
  //   setModalVisible2(true);
  // };

  // // Function to close the modal
  // const closeModal = () => {
  //   setSelectedFeature(null);
  //   setModalVisible(false);
  // };
  // const closeModal2 = () => {
  //   setModalVisible2(false);
  // };
  /**
   * render content
   * @returns {JSX.Element}
   */

  const renderContent = () => {
    customStyle = [
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#3c4646" }] },
      { "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#e6d2b4" }] },
      { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#8db580" }] },
      { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a0aaa0" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#fff8ef" }] },
      { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#fff8ef" }] },
      { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#d2aa78" }, { "weight": 3.5 }] },
      { "featureType": "poi.park", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
      // ... More styling rules for various map features
    ]

    if (pageStyle === 'map') {
      const initLocation = listing.data?.[0]?.location;
      return (
        <>
          <MapView
            ref={mapRef}
            style={Styles.flex}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            customMapStyle={customStyle}
            zoomEnabled={true}
            zoomControlEnabled={false}
            initialRegion={{
              latitude: 39.2087931411,
              longitude: 26.2549348658,
              latitudeDelta: 0.9,
              longitudeDelta: 0.9,
            }}
          >
            {geoJsonData && (
              <Geojson geojson={geoJsonData}
                strokeColor={website2 === 'b' ? 'blue' : 'red'}
                fillColor="rgba(255,0,0,0)" // Set the fill color
                strokeWidth={2} // Set the stroke width
              />
            )}

            {/* You can add Markers if needed */}
          </MapView>
          {/* <View style={styles.carouselContent}>
            <TouchableOpacity
              onPress={() => openModal2()}
              style={[
                styles.locationIcon,
                Styles.card,
                {
                  backgroundColor: theme.colors.card,
                },
              ]}>
              <Icon name="menu" color={theme.colors.primary} />
            </TouchableOpacity>

          </View> */}
          {/* Modal */}

        </>
      );
    }

    return (
      <FlatList
        key={modeView}
        ref={listRef}
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
        ListEmptyComponent={
          <Empty
            style={Styles.flex}
            title={t('not_found_matching')}
            message={t('please_try_again')}
            button={{ title: t('try_again'), onPress: onRefresh }}
          />
        }
        data={data}
        renderItem={renderItem}
        numColumns={modeView === 'grid' ? 2 : 1}
        keyExtractor={(item, index) => `${item?.id}${index}`}
        onEndReachedThreshold={0.1}
        onEndReached={onMore}
        style={Styles.flex}
        contentContainerStyle={[
          styles.listContainer,
          { backgroundColor: theme.colors.card },
          modeView === 'grid' && Styles.paddingHorizontal8,
        ]}
      />
    );
  };
  const _renderItem = ({ item, index }) => {
    // return (
    //   <View style={[
    //     styles.carouselItem,
    //     Styles.card,
    //     {
    //       backgroundColor: theme.colors.card,
    //     },
    //   ]}>
    //     {item.properties.gx_media_links &&
    //       Array.isArray(item.properties.gx_media_links) &&
    //       item.properties.gx_media_links.map((link, index) => {
    //         console.log('Link:', link); // Log the link here
    //         return (
    //           <Image key={index} source={{ uri: link }} style={{ width: width *0.7, height: 100, flexDirection: 'row',
    //           justifyContent: 'space-between', }} resizeMode='cover' />
    //         );
    //       })}
    //       <Text style={{color:'black'}} typography="title" weight="bold">{item.properties.Name}</Text>
    //   </View>
    // );

  };
  return (
    <ScreenContainer
      edges={['left', 'right', 'bottom']}
      navigation={navigation}
      options={{
        headerRight: () => {
          return (
            <View style={Styles.nativeRightButton}>
              {/*
              <IconButton onPress={onChangePageStyle} size="small">
                <Icon
                  name={
                    pageStyle === 'map' ? 'view-list-outline' : 'map-legend'
                  }
                />
                </IconButton> */}
            </View>
          );
        },
      }}>
      <View style={Styles.flex}>
        {/* {renderSelectSort()} 
        <Action
          style={{backgroundColor: theme.colors.card}}
          // sort={sort}
          modeView={modeView}
          onView={onChangeViewStyle}
          // onSort={sortRef.current?.present}
          // onFilter={onFilter}
        />*/}
        {renderContent()}

      </View>
    </ScreenContainer>
  );
}
