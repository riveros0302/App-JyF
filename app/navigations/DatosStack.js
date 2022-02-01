import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Datos from "../screens/Datos";

const Stack = createStackNavigator();

export default function DatosStack(props) {
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
