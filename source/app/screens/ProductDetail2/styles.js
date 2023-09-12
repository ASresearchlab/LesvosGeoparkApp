import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  listContainer: {flexGrow: 1, paddingVertical: 8},
  item: {marginBottom: 16},
  bottomSheetContainer: {
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  carouselItem: {
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width:150,
    borderRadius: 5,
    backgroundColor:'#065535',
    color: 'white',
    padding: 1,
    flexWrap: 'wrap',
    alignItems:'stretch',
    textAlign:'center',
  },
  button: {
    padding:20,
    backgroundColor:'#c0c9bd'
  },
  description: {
    lineHeight: 20,
    textAlign: 'justify',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:12,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  backButton: {
    width: 10,
    height: 10,
    zIndex: 999,
    textAlign: 'center',
  },
});
