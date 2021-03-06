import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Colors} from 'src/Theme';

export default StyleSheet.create({
  FindStuffHeaderContainer: {
    width: Dimensions.get('window').width,
    height: Platform.OS === 'android' ? 40 : 55,
    backgroundColor: '#0084da',
    alignItems: 'flex-end',
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FindStuffHeaderImg: {
    height: 30,
    width: 30,
    transform: [{rotate: '90deg'}],
  },
  CustomText: {
    fontSize: 30,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  CustomForm: {
    flex: 5,
    // flexDirection: 'column',
    // alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  CustomTextInput: {
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 30,
  },
  /** drawer styles */
  drawer: {
    backgroundColor: Colors.primary,
  },
  drawerIcon: {
    width: 33,
    height: 33,
  },
  drawerHeader: {
    marginTop: 10,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerText: {
    color: Colors.white,
    fontSize: 22,
    marginLeft: 12,
  },
  //////////////////////////////////
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    zIndex: 100,
  },
});
