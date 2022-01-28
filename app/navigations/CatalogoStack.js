import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";

import Catalogo from "../screens/Catalogo";

const Stack = createStackNavigator();

export default function CatalogoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="catalogo"
        component={Catalogo}
        options={{ title: "Catalogo" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
