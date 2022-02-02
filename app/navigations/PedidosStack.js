import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Pedidos from "../screens/Pedidos";
import DocumentPDF from "../components/pdf/DocumentPDF";
const Stack = createStackNavigator();

export default function PedidosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="pedidos"
        component={Pedidos}
        options={{ title: "Mis Pedidos" }}
      />
      <Stack.Screen
        name="documento"
        component={DocumentPDF}
        options={{ title: "Mi PDF" }}
      />
    </Stack.Navigator>
  );
}
