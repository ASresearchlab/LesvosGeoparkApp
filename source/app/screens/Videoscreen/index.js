import React, { useContext, useRef, useState } from 'react';
import {
  Application,
  Icon,
  IconButton,
  Image,
  ImageSlider,
  ScreenContainer,
  Text,
} from '@components';
import { Colors, Images, Styles } from '@configs';
import { FlatList, Pressable, View } from 'react-native';
import styles from './styles';
import { WebView } from 'react-native-webview';

export default function Index({ navigation, route }) {
  const { theme } = useContext(Application);
  const listRef = useRef();
  const galleryRef = useRef();

  const [indexSelected, setIndexSelected] = useState(0);

  const product = route.params?.item;

  /**
   * on press image
   * @param value
   */
  const onPressImage = value => {
    if (value === indexSelected) {
      return;
    }
    galleryRef.current?.snapToItem(value);
  };

  /**
   * on change index
   * @param value
   */
  const onChange = value => {
    setIndexSelected(value);
    listRef.current?.scrollToIndex({
      animated: true,
      index: value,
    });
  };

  /**
   * render image item
   * @param item
   * @param index
   * @returns {JSX.Element}
   */
  const renderItem = ({ item, index }) => {
    return (
      <Pressable onPress={() => onPressImage(index)}>
        <Image
          style={[
            styles.imageItem,
            index === indexSelected && { borderColor: theme.colors.primary },
          ]}
          source={{ uri: item.full }}
        />
      </Pressable>
    );
  };

  const videoPlayer = () => {
    const videoUrl = product;
    //console.log(product);
    const videoHTML = `
    <video controls controlsList="nodownload" width="100%" height="560">
      <source src="${videoUrl}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;

    return (
      <View style={{ flex: 1, }}>
        <WebView source={{ html: videoHTML }} />
      </View>
    );
  };
  return (
    <ScreenContainer
      navigation={navigation}
      style={{ backgroundColor: Colors.black }}
      options={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: 'black',
      }}>
      <View style={Styles.flex}>

      </View>
      {videoPlayer()}
      <View style={Styles.flex}>

      </View>
    </ScreenContainer>
  );

}
