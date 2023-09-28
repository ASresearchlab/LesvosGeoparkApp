import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: windowWidth * 0.06, // Responsive font size
    color: "#393636",
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.03, // Responsive margin
  },
  logo: {
    width: windowWidth * 0.6, // Responsive width
    height: windowHeight * 0.1, // Responsive height
    marginBottom: windowHeight * 0.2,
  },
  contentLogo2: {
    backgroundColor: "white",
    padding: windowWidth * 0, // Responsive padding
    alignItems: 'center',
    marginTop: windowHeight * 0.20, // Responsive margin
  },
  logo2: {
    width: windowWidth * 0.95, // Responsive width
    height: windowHeight * 0.25, // Responsive height
  },
  descriptionText: {
    fontSize: windowWidth * 0.03, // Responsive font size
    fontWeight: 'normal',
    color: 'gray',
    textAlign: 'center',
    marginTop: windowHeight * 0.18, // Responsive margin
  },
  loading: {
    position: 'absolute',
    alignItems:'center',
    textAlign:'center',
    bottom: windowHeight * 0.50, // Responsive position from bottom
  },
});
