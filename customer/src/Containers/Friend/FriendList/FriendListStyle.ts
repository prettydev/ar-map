import {StyleSheet, Dimensions} from 'react-native';
export default StyleSheet.create({
  HeaderRightImg: {
    width: 30,
    height: 30,
  },
  CategoryListContainer: {flex: 1},
  CategoryListHeader: {
    height: 50,
    backgroundColor: '#0084da',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CategoryListWrap: {
    padding: 5,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  CategoryFlatList: {
    flexDirection: 'column',
  },
  ///////////////////////////
  HomeSearchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    margin: 10,
  },
  HomeSearchImg: {
    width: 20,
    height: 20,
  },
  HomeSearchInputContainer: {
    flexDirection: 'row',
    flex: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: 'black',
  },
  HomeSearchInput: {
    height: 38,
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
  },

  HomeSearchBtn: {
    flex: 1,
    padding: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    backgroundColor: 'black',
  },

  ////////////////////////////////
  text: {textAlign: 'center'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  dataRow: {height: 30},
  border: {borderWidth: 0.3, borderColor: '#c8e1ff'},
  table: {margin: 12},
});
