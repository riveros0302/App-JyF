import React, { useState } from "react";
import { Image, Dimensions } from "react-native";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import CatalogoStack from "./CatalogoStack";
import DatosStack from "./DatosStack";
import PedidosStack from "./PedidosStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { height, width } = Dimensions.get("screen");
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Image
        source={require("../../assets/img/Fondo.jpg")}
        style={{
          height,
          width,
          position: "absolute",
          opacity: 0.7,
        }}
      />
      <Tab.Navigator
        initialRouteName="catalogo"
        tabBarOptions={{
          inactiveTintColor: "#646464",
          activeTintColor: "#00a680",
          tabStyle: { marginTop: -20, backgroundColor: "white" },
          labelStyle: { fontSize: 15 },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="cataloge"
          component={CatalogoStack}
          options={{ title: "Catalogo" }}
        />
        <Tab.Screen
          name="datos"
          component={DatosStack}
          options={{ title: "Mis Datos" }}
        />
        <Tab.Screen
          name="pedidos"
          component={PedidosStack}
          options={{ title: "Mis Pedidos" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case "cataloge":
      iconName = "view-dashboard-outline";
      break;
    case "datos":
      iconName = "account-outline";
      break;
    case "pedidos":
      iconName = "clipboard-list-outline";
      break;
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
