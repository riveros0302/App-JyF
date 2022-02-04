import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Pedidos from "../screens/Pedidos";
import Borrar from "../components/pdf/Borrar";
import Mail from "../components/pdf/Mail";
const Stack = createStackNavigator();

export default function PedidosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="pedidos"
        component={Pedidos}
        options={{ title: "Mis Pedidos" }}
      />
    </Stack.Navigator>
  );
}
