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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const product = route.params?.item;


  //maproute
  useEffect(() => {
    const geoJsonUrl = product?.status;

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
  const onMarkerPress = (feature) => {
    setSelectedFeature(feature);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedFeature(null);
    setModalVisible(false);
  };
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
            zoomControlEnabled={true}
            initialRegion={{
              latitude: 39.2087931411,
              longitude: 26.2549348658,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {geoJsonData &&
              geoJsonData.features.map((feature, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0],
                  }}
                //onPress={() => onMarkerPress(feature)}
                //number={index = index + 1}
                >
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
                    {index += 1}
                  </Text>
                  <Callout tooltip={true} onPress={() => onMarkerPress(feature)}>

                    <Text style={styles.title}><Icon name="chevron-up" color={theme.colors.secondary} Back to Map />{feature.properties.Name}</Text>
                    {/* Add any other information you want to display in the Callout */}
                  </Callout>
                  {/* <Image source={Images.mapPin} style={{ width: 40, height: 40, resizeMode: "contain" }} /> */}
                  {/* <Text style={styles.title}>{feature.properties.Name}</Text>
                    <Text>
                      <WebView source={{ uri: feature.properties.gx_media_links }} style={{ width: 120, height: 120}} />
                    </Text>
                    <Text style={styles.title}>{feature.properties.description}</Text>
                    <Button title='Δείτε περισσότερα'></Button> */}
                </Marker>
              ))}
            {geoJsonData &&
              geoJsonData.features.length > 1 &&
              geoJsonData.features.map((feature, index) => {
                if (index < geoJsonData.features.length - 1) {
                  const originCoords = feature.geometry.coordinates;
                  const destinationCoords = geoJsonData.features[index + 1].geometry.coordinates;
                  return (
                    <MapViewDirections
                      key={index}
                      origin={{
                        latitude: originCoords[1],
                        longitude: originCoords[0],
                      }}
                      destination={{
                        latitude: destinationCoords[1],
                        longitude: destinationCoords[0],
                      }}
                      apikey={'AIzaSyDsyKauf-1xG9g4hoL4OSfx1h-yI0s0Kq4'}
                      strokeWidth={5}
                      strokeColor='orange'
                    />
                  );
                }
                return null;
              })}
          </MapView>
          {/* Modal */}
          <Modal style={styles.rowContent} visible={isModalVisible} animationType="slide" >
            <Pressable
              style={[styles.button]}
              onPress={closeModal}>
              <Icon name="arrow-left" color={theme.colors.primary} Back to Map />
            </Pressable>
            <ScrollView style={{ backgroundColor: '#c0c9bd' }}>
              <View style={{ paddingHorizontal: 16 }}>
                {Array.isArray(selectedFeature?.properties.gx_media_links) && (
                  <FlatList
                  horizontal
                  showsVerticalScrollIndicator={true}
                  scrollEnabled={true}
                  data={selectedFeature.properties.gx_media_links}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ marginRight: 10 }}>
                      <Image
                        source={{ uri: item }}
                        style={{
                          width: 200,
                          aspectRatio: 1,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: 'black',
                          padding: 5,
                        }}
                      />
                    </View>
                  )}
                />
                ) }
                <SizedBox height={10} />
                <Divider />
                <SizedBox height={10} />
                
                
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                  {selectedFeature?.properties.Name}
                </Text>
                <SizedBox height={20} />
                <Divider />
                <SizedBox height={40} />
                <Text typography="subtitle" style={styles.description}>
                  {selectedFeature?.properties.description}
                </Text>
                {/* Add any other information you want to display in the modal */}
              </View>
            </ScrollView>
          </Modal>
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
