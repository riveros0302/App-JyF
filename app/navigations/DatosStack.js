import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Datos from "../screens/Datos";

const Stack = createStackNavigator();

export default function DatosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="datos"
        component={Datos}
        options={{ title: "Mis Datos" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
