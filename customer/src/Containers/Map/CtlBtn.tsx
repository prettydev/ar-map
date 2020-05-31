import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Colors from "src/Theme/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/**
 *
 * @param props
 * alpha: alpha condition
 * proc:  btn proc function
 * icon:  btn icon name
 */

export default function CtlBtn(props) {
  return (
    <TouchableOpacity
      style={{
        padding: 5,
        margin: 2,
        borderRadius: 5,
        backgroundColor: props.alpha ? Colors.primary : Colors.primaryAlpha,
      }}
      onPress={props.proc}
    >
      <MaterialIcons
        name={props.icon}
        color={props.color ? props.color : "white"}
        size={25}
      />
    </TouchableOpacity>
  );
}
