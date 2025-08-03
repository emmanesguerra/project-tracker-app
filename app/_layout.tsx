import { initializeDatabase } from '@/src/database/init';
import { insertDummyData } from '@/src/database/seed'; // ← Add this
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  const handleInit = async (db: any) => {
    await initializeDatabase(db);
    await insertDummyData(db); // ← Seed data after init
  };

  return (
    <SQLiteProvider databaseName="pos_system.db" onInit={handleInit}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
