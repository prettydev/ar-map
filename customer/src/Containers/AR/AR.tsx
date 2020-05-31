import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import FastImage from "react-native-fast-image";
import { Images } from "src/Theme";
import CatListBtn from "src/Components/Buttons/CatListBtn/CatListBtn";
import Style from "src/Style";
import Colors from "src/Theme/Colors";
import Header from "src/Components/Header/Header";
import ProductCard from "src/Components/Card/Product/ProductCard";
import { tagJson } from "src/config";
import { baseUrl } from "src/config";
import { store } from "src/Store";

import SearchBox from "./SearchBox";
import Toast from "react-native-simple-toast";
import EvilIconsIcon from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import axios from "axios";

export default function AR(props) {
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Text>AR screen</Text>
    </ScrollView>
  );
}
