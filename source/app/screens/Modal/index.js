import React from 'react';
import {
  View,
  TouchableHighlight,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ScreenContainer} from '@components';
import {Styles} from '@configs';
import styles from './styles';

export default function Modal({navigation, route}) {
  /**
   * onPress outside modal
   */
  const onDismiss = () => {
    if (route.params?.cancelable) {
      navigation.pop();
    }
  };

  return (
    <ScreenContainer navigation={navigation} edges={[]}>
      <KeyboardAvoidingView
        style={Styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable onPress={onDismiss} style={Styles.flexCenter}>
          <TouchableHighlight style={styles.container}>
            {route.params?.component ?? <View />}
          </TouchableHighlight>
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
