import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  large: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    minWidth: 128,
  },
  medium: {
    height: 36,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    minWidth: 80,
  },
  small: {
    height: 50,
    borderTopRightRadius: 10, // Apply border radius to the top-left corner
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    minWidth: 40,
  },
  leading: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
