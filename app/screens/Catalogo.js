import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, ScrollView, RefreshControl } from "react-native";

import ListCatalogo from "../components/catalogo/ListCatalogo";
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");

  /*db.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () =>
    console.log("Foreign keys turned on")
  );*/

  return db;
}

const db = openDatabase();

export default function Catalogo() {
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS pedidos (id_ped INTEGER PRIMARY KEY NOT NULL, cant_ped INT, total_ped TEXT, id_prod INT REFERENCES productos(id_prod), nota_ped TEXT);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS productos (id_prod INTEGER PRIMARY KEY NOT NULL, nom_prod TEXT, desc_prod TEXT, marca_prod TEXT, precio_prod INT, ruta_img TEXT, cant_prod);"
      );
    });
  }, []);

  return <ListCatalogo refresh={refresh} />;
}
