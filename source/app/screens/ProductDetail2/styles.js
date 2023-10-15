import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  listContainer: { flexGrow: 1, paddingVertical: 8 },
  item: { marginBottom: 16 },
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
  carouselContainer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  feutureItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 1,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '92%',
    fontWeight: 'bold',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  title: {
    width: 150,
    borderRadius: 5,
    backgroundColor: '#065535',
    color: 'white',
    padding: 1,
    flexWrap: 'wrap',
    alignItems: 'stretch',
    textAlign: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: '#c0c9bd'
  },
  button2: {
    padding: 10,
    right: 0,
    marginLeft: 'auto'
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
    fontSize: 12,
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
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    height: 200,
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
  },
  paginationContainer: {
    marginTop: -20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: 'blue',
  },
  paginationInactiveDot: {
    backgroundColor: 'gray',
  },
});
