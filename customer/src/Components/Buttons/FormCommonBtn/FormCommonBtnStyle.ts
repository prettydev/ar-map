import {StyleSheet} from 'react-native';
import Colors from 'src/Theme/Colors';
export default StyleSheet.create({
  FormCommonBtn: {
    width: '90%',
    height: 45,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  FormCommonBtnText: {
    color: '#fff',
    fontSize: 20,
  },
});
