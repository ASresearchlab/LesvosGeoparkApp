import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userImage: {width: 40, height: 40, borderRadius: 20},
  statusContent: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  rateContent: {
    alignItems: 'flex-start',
  },
  tagRate: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 28,
    alignItems: 'center',
  },
  iconInfo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subInfoContent: {
    paddingLeft: 40,
  },
  rowHour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowAttachment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialItem: {marginRight: 8, width: 32, height: 32, marginBottom: 8},
  flexAlignRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tagItem: {
    marginRight: 8,
    marginBottom: 8,
  },
  smallProductItem: {marginBottom: 16},
  linePlaceholder: {
    height: 24,
    width: '100%',
    marginBottom: 16,
  },
  description: {lineHeight: 20},
  bottomSheetContainer: {paddingLeft: 16, paddingVertical: 8},
  bottomSheetShare: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  userImageShare: {width: 40, height: 40, borderRadius: 20},
  backgroundVideo: {position: 'absolute', width: '100%', height: '100%'},
  videoActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  videoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //real estate style
  sliderDot8: {bottom: 8},
  mapsContent: {
    width: '100%',
    height: 200,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  //food style
  sliderDotFood64: {bottom: 64},
  cardInfo: {
    height: 120,
    marginTop: -60,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
  },
  foodStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    margin: 8,
  },
  videoActionsFood: {
    position: 'absolute',
    bottom: 68,
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
