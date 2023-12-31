import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import MapView, {Marker, PROVIDER_GOOGLE,Geojson} from 'react-native-maps';
import {
  FlatList,
  RefreshControl,
  PermissionsAndroid,
  useWindowDimensions,
  View,
  Image,
  TouchableOpacity
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
import {Styles} from '@configs';
import {listingActions} from '@actions';
import Action from './components/action';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {listingSelect, settingSelect} from '@selectors';
import {FilterModel} from '@models';
import Carousel from 'react-native-snap-carousel';
import {enableExperimental, getCurrentLocation} from '@utils';
import { init } from 'i18next';

export default function Index({navigation, route}) {
  const {t} = useTranslation();
  const {theme} = useContext(Application);
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const listing = useSelector(listingSelect);
  const setting = useSelector(settingSelect);
  const listRef = useRef();
  //const sortRef = useRef();
  const mapRef = useRef();
  const sliderRef = useRef();
  const filter = useRef(FilterModel.fromSettings(setting)).current;
  const defaultDelta = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

  const [refreshing, setRefreshing] = useState(false);
  const [pageStyle, setPageStyle] = useState('listing');
  const [modeView, setModeView] = useState('grid');
  //const [sort, setSort] = useState(filter.sort);

  useEffect(() => {
    
    if (route.params?.item) {
      filter.setCategory = route.params?.item;
    }
    dispatch(listingActions.onLoad({filter}));
    return () => dispatch(listingActions.onReset());
  }, [dispatch, filter, route.params]);

  /**
   * on refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(
      listingActions.onLoad({filter}, () => {
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
      mapRef.current?.animateToRegion({...result, ...defaultDelta}, 500);
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
  

  /**
   * on filter
   */
  const onFilter = () => {
    navigation.navigate('Filter', {
      filter,
      onApply: () => {
        listRef.current?.scrollToOffset({offset: 0, animated: true});
        dispatch(listingActions.onLoad({filter, loading: true}));
      },
    });
  };

  /**
   * on press product
   */
  const onPressProduct = item => {
    navigation.navigate('ProductDetail', {item});
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
  const renderItem = ({item}) => {
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
      return Array.from({length: 10}, () => {
        return {};
      });
    }
  }, [listing]);

  /**
   * render bottom sheet select sort list
   * @returns {JSX.Element}
   */
  const renderSelectSort = () => {

  }

  /**
   * render content
   * @returns {JSX.Element}
   */
  const renderContent = () => {
   
   
    if (pageStyle === 'map') {
      const geo= 'https://www.discoveramari.gr/wp-content/diadromes/Tracks.json'
      
      const initLocation = listing.data?.[0]?.location;
     console.log(initLocation)
      return (
        <>
          <MapView
          onMapReady={() => {                
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ).then(granted => {
              console.log("test",granted) // just to ensure that permissions were granted
            },reason=> {console.log(reason)
            })      ;
          }}        
                      
            ref={mapRef}
            style={Styles.flex}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}   
            zoomControlEnabled={true}       
            initialRegion={{
              latitude: 35.246374,
              longitude: 24.570199,
              ...defaultDelta,
              ...initLocation,
            }}>
            {/* <Geojson 
                geojson={myplace}
                strokeColor="#9ea192"
                fillColor="green"
                strokeWidth={4}
            />    */}
            {listing.data?.map?.((item,index) => { 
              return <Marker onPress={ () =>{ ;sliderRef.current.snapToItem(index);} } key={item?.id} coordinate={item.location}>
                 <Image source={{uri: listing.data[1]?.category?.iconcategory}} style={{width:50,height:50}} resizeMode='contain' key="maps"/>
              </Marker>;
            })}            
          </MapView>
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
            <Carousel
              ref={sliderRef}
              data={listing.data ?? []}
              renderItem={({item, index}) => {
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
              
              sliderWidth={width}
              itemWidth={width}
              onSnapToItem={index => {
                const item = listing.data[index];
                mapRef.current?.animateToRegion(
                  {...item.location, ...defaultDelta},
                  500,
                );
              }}
            />
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
            button={{title: t('try_again'), onPress: onRefresh}}
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
          {backgroundColor: theme.colors.card},
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
              <IconButton onPress={onChangePageStyle} size="small">
                <Icon
                  name={
                    pageStyle === 'map' ? 'view-list-outline' : 'map-legend'
                  }
                />
              </IconButton>
            </View>
          );
        },title:route.params?.item?.title
      }}>
      <View style={Styles.flex}>
        
        {pageStyle=='listing' &&
        <Action
          style={{backgroundColor: theme.colors.card}}
          //sort={sort}
          modeView={modeView}
          onView={onChangeViewStyle}
          //onSort={sortRef.current?.present}
          onFilter={onFilter}
        />
        }
        {renderContent()}
      </View>
    </ScreenContainer>
  );
}
