import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Geojson } from 'react-native-maps';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
  Text,
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
} from '@components';
import { Styles } from '@configs';
import { listingActions } from '@actions';
import Action from './components/action';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { listingSelect, settingSelect } from '@selectors';
import { FilterModel } from '@models';
import Carousel from 'react-native-snap-carousel';
import { enableExperimental, getCurrentLocation } from '@utils';
import MapViewDirections from 'react-native-maps-directions';

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




  //maproute
  useEffect(() => {
    const geoJsonUrl =
      'https://lesvosgeopark.aegeansolutions.com/wp-content/uploads/2023/07/routes1.geojson';

    fetch(geoJsonUrl)
      .then((response) => response.json())
      .then((data) => {
        setGeoJsonData(data); // Store the fetched GeoJSON data in the state
        const route = data.features[0].geometry.coordinates; // Assuming you're interested in the first route
        const [startLng, startLat] = route[0];
        const [endLng, endLat] = route[route.length - 1];

        setOrigin({ latitude: startLat, longitude: startLng });
        setDestination({ latitude: endLat, longitude: endLng });
      })
      .catch((error) => {
        console.error('Error fetching GeoJSON:', error);
      });
  }, []);

  // const myPlace = {
  //   "type": "FeatureCollection",
  //   "name": "Οδηγίες από Σημείο 1 προς Σημείο 4",
  //   "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  //   "features": [
  //     { "type": "Feature", "properties": { "Name": "Οδηγίες από Σημείο 1 προς Σημείο 4" }, "geometry": { "type": "LineString", "coordinates": [[26.55317, 39.09753], [26.55322, 39.09753], [26.55322, 39.09757], [26.55322, 39.09775], [26.55322, 39.09793], [26.55322, 39.09811], [26.55299, 39.09812], [26.55276, 39.09813], [26.55253, 39.09814], [26.55244, 39.09814], [26.55221, 39.09814], [26.55198, 39.09814], [26.55175, 39.09814], [26.55152, 39.09814], [26.55129, 39.09815], [26.55124, 39.09815], [26.55095, 39.09816], [26.55067, 39.09817], [26.55038, 39.09819], [26.55029, 39.09819], [26.55029, 39.09802], [26.55029, 39.09785], [26.55028, 39.09773], [26.55027, 39.0976], [26.55056, 39.09759], [26.55085, 39.09758], [26.55109, 39.09756], [26.55114, 39.09756], [26.55123, 39.09756], [26.55127, 39.09756], [26.5515, 39.09756], [26.55173, 39.09757], [26.55173, 39.0975], [26.55172, 39.09732], [26.55177, 39.09714], [26.55177, 39.097], [26.55121, 39.09701], [26.55099, 39.097], [26.55092, 39.097], [26.55075, 39.097], [26.55052, 39.09701], [26.55029, 39.09701], [26.55028, 39.09701], [26.55028, 39.09706], [26.55028, 39.09724], [26.55027, 39.09742], [26.55027, 39.0976], [26.55056, 39.09759], [26.55085, 39.09758], [26.55109, 39.09756], [26.55114, 39.09756], [26.55123, 39.09756], [26.55127, 39.09756], [26.5515, 39.09756], [26.55173, 39.09757], [26.55187, 39.09756], [26.5521, 39.09755], [26.55233, 39.09755], [26.55249, 39.09754], [26.55249, 39.09702]] } },
  //     { "type": "Feature", "properties": { "Name": "Σημείο 1" }, "geometry": { "type": "Point", "coordinates": [26.5531685, 39.0975328] } },
  //     { "type": "Feature", "properties": { "Name": "Σημείο 2" }, "geometry": { "type": "Point", "coordinates": [26.5517294, 39.0975675] } },
  //     { "type": "Feature", "properties": { "Name": "Σημείο 3" }, "geometry": { "type": "Point", "coordinates": [26.5517701, 39.0969995] } },
  //     { "type": "Feature", "properties": { "Name": "Σημείο 4" }, "geometry": { "type": "Point", "coordinates": [26.5524869, 39.0970164] } }
  //   ]
  // };


  //maproute end
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

  /**
   * render content
   * @returns {JSX.Element}
   */
  const renderContent = () => {
    customStyle = [
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3c4646"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e6d2b4"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#8db580"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a0aaa0"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fff8ef"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#fff8ef"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#d2aa78"
          },
          {
            "weight": 3.5
          },

        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.attraction",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.government",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.medical",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.place_of_worship",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.school",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.sports_complex",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
    if (pageStyle === 'map') {
      const initLocation = listing.data?.[0]?.location;
      return (
        <>
          {origin && destination && (
            <MapView
              ref={mapRef}
              style={Styles.flex}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              customMapStyle={customStyle}
              zoomEnabled={true}
              zoomControlEnabled={true}
              initialRegion={{
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              <Marker coordinate={origin} title="Origin" />
              <Marker coordinate={destination} title="Destination" />

              {/* Render GeoJSON data */}
              {geoJsonData && (
                <Geojson
                  geojson={geoJsonData} // Use the fetched GeoJSON data here
                  strokeColor="red"
                  fillColor="green"
                  strokeWidth={2}
                />
              )}
            </MapView>
          )}
          <View style={styles.carouselContent}>
            <TouchableOpacity
              onPress={onCurrentLocation}
              style={[
                styles.locationIcon,
                Styles.card,
                {
                  backgroundColor: theme.colors.card,
                },
              ]}>
              <Icon name="map-marker" color={theme.colors.primary} />
            </TouchableOpacity>
            {/* <Carousel
              ref={sliderRef}
              data={listing.data ?? []}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item?.id}${index}${modeView}`}
                    style={[
                      styles.carouselItem,
                      Styles.card,
                      {
                        backgroundColor: theme.colors.card,
                      },
                    ]}>
                    <ProductItem
                      item={item}
                      onPress={() => onPressProduct(item)}
                      type={modeView}
                    />
                  </View>
                );
              }}
              sliderWidth={width +60}
              itemWidth={width-40}
              onSnapToItem={index => {
                const item = listing.data[index];
                mapRef.current?.animateToRegion(
                  { ...item.location, ...defaultDelta },
                  500,
                );
              }}
            />  */}
          </View>
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
