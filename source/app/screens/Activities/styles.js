import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    paddingTop: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {paddingVertical: 8, flexGrow: 1},
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productItem: {width: 130, height: 160, paddingHorizontal: 8},
  productItem2: {width: '100%', height: 160, paddingHorizontal: 8, padding:4},
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    elevation: 3, // Add elevation for a shadow effect
    padding: 8,
  },

  gridContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
