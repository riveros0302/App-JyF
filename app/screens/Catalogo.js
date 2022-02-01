import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, ScrollView, RefreshControl } from "react-native";

import ListCatalogo from "../components/catalogo/ListCatalogo";
import { openDatabase } from "../utils/database";

const db = openDatabase();

export default function Catalogo() {
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS pedidos (id_ped INTEGER PRIMARY KEY NOT NULL, cant_ped INT, total_ped TEXT, id_prod INT REFERENCES productos(id_prod), nota_ped TEXT);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS productos (id_prod INTEGER PRIMARY KEY NOT NULL, nom_prod TEXT, desc_prod TEXT, marca_prod TEXT, precio_prod INT, ruta_img TEXT, cant_prod INT);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS datos (dt_id INTEGER PRIMARY KEY NOT NULL, dt_nom TEXT, dt_ape TEXT, dt_empresa TEXT, dt_correo TEXT, dt_fono TEXT, dt_com TEXT);"
      );
    });
  }, []);

  return <ListCatalogo refresh={refresh} />;
}
