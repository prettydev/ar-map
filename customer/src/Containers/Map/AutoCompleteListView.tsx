import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import Events from 'react-native-simple-events';

export default function AutoCompleteListView(props) {
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    Events.listen('InputBlur', 'ListViewID', _onTextBlur);
    Events.listen('InputFocus', 'ListViewID', _onTextFocus);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return () => {
      Events.rm('InputBlur', 'ListViewID');
      Events.rm('InputFocus', 'ListViewID');
    };
  }, []);

  const _onTextFocus = () => {
    setInFocus(true);
  };

  const _onTextBlur = () => {
    setInFocus(false);
  };

  const _renderItem = ({item}) => {
    const TouchableControl =
      Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
    const {structured_formatting} = item;
    return (
      <TouchableControl
        onPress={() => Events.trigger('PlaceSelected', item.place_id)}>
        <View style={styles.row}>
          <Text style={styles.primaryText} numberOfLines={1}>
            {structured_formatting.main_text}
          </Text>
          <Text style={styles.secondaryText} numberOfLines={1}>
            {structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableControl>
    );
  };

  const _getFlatList = () => {
    const style = inFocus ? null : {height: 0};
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        elevation={3}
        style={[styles.list, style]}
        data={props.predictions}
        renderItem={_renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={item => item.id}
      />
    );
  };

  return Platform.OS === 'android' ? (
    _getFlatList()
  ) : (
    <View style={styles.listContainer}>{_getFlatList()}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 5,
  },
  list: {
    backgroundColor: 'white',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    maxHeight: 220,
  },
  listContainer: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.24,
    backgroundColor: 'transparent',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  primaryText: {
    color: '#545961',
    fontSize: 14,
  },
  secondaryText: {
    color: '#A1A1A9',
    fontSize: 13,
  },
});
